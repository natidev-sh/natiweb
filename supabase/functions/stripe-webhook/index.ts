import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(err.message, { status: 400 });
  }

  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (!userId || !customerId || !subscriptionId) {
          throw new Error('Missing metadata from checkout session.');
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

        const { error } = await serviceClient
          .from('profiles')
          .update({
            stripe_customer_id: customerId as string,
            subscription_status: subscription.status,
            plan_id: subscription.items.data[0].price.id,
            subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', userId);
        
        if (error) throw error;
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: profile } = await serviceClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId as string)
          .single();

        if (!profile) throw new Error('Profile not found for customer.');

        const { error } = await serviceClient
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            plan_id: subscription.items.data[0].price.id,
            subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', profile.id);
        
        if (error) throw error;
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});