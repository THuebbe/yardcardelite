import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define webhook secrets
const WEBHOOK_SECRET_SNAPSHOT = process.env.STRIPE_WEBHOOK_SECRET!;
const WEBHOOK_SECRET_THIN =
  process.env.STRIPE_WEBHOOK_SECRET_THIN || process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  let isVerified = false;

  // Try to verify with snapshot secret first
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET_SNAPSHOT,
    );
    isVerified = true;
  } catch (snapshotError) {
    console.log("Failed to verify with snapshot secret, trying thin secret...");

    // If snapshot verification fails, try with thin secret
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        WEBHOOK_SECRET_THIN,
      );
      isVerified = true;
    } catch (thinError: any) {
      console.error(
        `Webhook signature verification failed with both secrets: ${thinError.message}`,
      );
      return NextResponse.json({ error: thinError.message }, { status: 400 });
    }
  }

  if (!isVerified || !event) {
    return NextResponse.json(
      { error: "Event verification failed" },
      { status: 400 },
    );
  }

  const supabase = createClient();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, planId, planName } = session.metadata || {};

      if (userId && planId) {
        try {
          // Get customer and subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );

          // Update or create subscription record in Supabase
          const { error } = await supabase.from("subscriptions").upsert({
            user_id: userId,
            status: subscription.status,
            plan: planId,
            plan_name: planName || "",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(
              subscription.current_period_start * 1000,
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
          });

          if (error) {
            console.error("Error updating subscription:", error);
          }
        } catch (error: any) {
          console.error(
            `Error processing checkout.session.completed: ${error.message}`,
          );
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      try {
        // Find the user with this subscription
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (subscriptionData) {
          // Update subscription status
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              current_period_start: new Date(
                subscription.current_period_start * 1000,
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000,
              ).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          if (error) {
            console.error("Error updating subscription:", error);
          }
        }
      } catch (error: any) {
        console.error(
          `Error processing customer.subscription.updated: ${error.message}`,
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      try {
        // Update subscription status to canceled
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error canceling subscription:", error);
        }
      } catch (error: any) {
        console.error(
          `Error processing customer.subscription.deleted: ${error.message}`,
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
