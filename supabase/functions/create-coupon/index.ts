import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || profile?.role !== 'admin') {
      throw new Error('Forbidden: Admins only');
    }

    const { code, discount_type, discount_value, duration, duration_in_months, max_redemptions, expires_at } = await req.json();

    // 1. Create the Coupon in Stripe
    const couponParams: Stripe.CouponCreateParams = {
      name: code,
      duration: duration as Stripe.CouponCreateParams.Duration,
    };
    if (discount_type === 'percentage') {
      couponParams.percent_off = Number(discount_value);
    } else {
      couponParams.amount_off = Number(discount_value) * 100; // Stripe expects cents
      couponParams.currency = 'usd';
    }
    if (duration === 'repeating') {
      couponParams.duration_in_months = Number(duration_in_months);
    }
    const stripeCoupon = await stripe.coupons.create(couponParams);

    // 2. Create the Promotion Code in Stripe
    const promoCodeParams: Stripe.PromotionCodeCreateParams = {
      coupon: stripeCoupon.id,
      code: code.toUpperCase(),
    };
    if (max_redemptions) promoCodeParams.max_redemptions = Number(max_redemptions);
    if (expires_at) promoCodeParams.expires_at = Math.floor(new Date(expires_at).getTime() / 1000);
    const stripePromoCode = await stripe.promotionCodes.create(promoCodeParams);

    // 3. Save to our database
    const { data, error } = await serviceClient
      .from('coupons')
      .insert({
        code: stripePromoCode.code,
        stripe_promotion_code_id: stripePromoCode.id,
        stripe_coupon_id: stripeCoupon.id,
        discount_type,
        discount_value,
        duration,
        duration_in_months,
        max_redemptions,
        expires_at,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});