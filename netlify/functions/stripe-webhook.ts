import Stripe from 'stripe';
import PocketBase from 'pocketbase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil',
});

const pb = new PocketBase(process.env.VITE_POCKETBASE_URL || 'https://mjwdesign-core.pockethost.io');

export const handler = async (event: {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string>;
}) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      webhookSecret || ''
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    return { statusCode: 400, body: `Webhook Error: ${message}` };
  }

  try {
    if (stripeEvent.type === 'customer.subscription.created') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await pb.collection('users').update(userId, {
          tier: 'tin_foil',
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
        });
      }
    }

    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await pb.collection('users').update(userId, {
          tier: 'free',
          stripe_subscription_id: '',
        });
      }
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    return { statusCode: 500, body: `Processing error: ${message}` };
  }
};
