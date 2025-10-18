import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno"

// Stripe Price IDs are now read from environment variables
const MONTHLY_PRICE_ID = Deno.env.get('STRIPE_MONTHLY_PRICE_ID');
const YEARLY_PRICE_ID = Deno.env.get('STRIPE_YEARLY_PRICE_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check for required environment variables
    if (!MONTHLY_PRICE_ID || !YEARLY_PRICE_ID) {
      throw new Error('Missing Stripe Price ID environment variables. Please set STRIPE_MONTHLY_PRICE_ID and STRIPE_YEARLY_PRICE_ID in your Supabase project secrets.');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('User not found');

    const { plan, couponCode } = await req.json();
    if (!plan || (plan !== 'monthly' && plan !== 'yearly')) {
      throw new Error('Invalid plan specified. Must be "monthly" or "yearly".');
    }

    const priceId = plan === 'monthly' ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID;
    const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:5173';

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // Ignore 'not found' error
      throw profileError;
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      const { error: updateError } = await serviceClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/download#pro-pricing`,
      metadata: { user_id: user.id },
      allow_promotion_codes: true, // Allow codes on Stripe's page as a fallback
    };

    if (couponCode) {
      const { data: couponData, error: couponError } = await serviceClient
        .from('coupons')
        .select('stripe_promotion_code_id')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (couponError || !couponData) {
        // Don't throw an error, just proceed without the coupon
        console.warn(`Invalid or inactive coupon code used: ${couponCode}`);
      } else {
        sessionParams.discounts = [{ promotion_code: couponData.stripe_promotion_code_id }];
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})