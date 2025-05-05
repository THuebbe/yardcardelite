import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Check if the Stripe secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

// Initialize Stripe only if the key is available
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(req: Request) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe API key is not configured" },
        { status: 500 },
      );
    }

    const { planId, userId } = await req.json();

    if (!planId || !userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Get the product from Stripe
    const product = await stripe.products.retrieve(planId, {
      expand: ["default_price"],
    });

    if (!product.default_price) {
      return NextResponse.json(
        { error: "Product has no default price" },
        { status: 400 },
      );
    }

    const priceId =
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price.id;

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/dashboard?canceled=true`,
      metadata: {
        userId,
        planId,
        planName: product.name,
      },
      customer_email: await getUserEmail(userId),
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

async function getUserEmail(userId: string): Promise<string | undefined> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user email:", error);
      return undefined;
    }

    return data?.email;
  } catch (error) {
    console.error("Error in getUserEmail:", error);
    return undefined;
  }
}
