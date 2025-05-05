import { NextResponse } from "next/server";
import Stripe from "stripe";

// Check if the Stripe secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

// Initialize Stripe only if the key is available
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function GET() {
  // If Stripe is not initialized, return fallback plans
  if (!stripe) {
    console.log("Using fallback plans due to missing Stripe API key");
    return NextResponse.json({
      plans: [
        {
          id: "basic-plan",
          name: "Basic",
          description:
            "Essential tools for yard card businesses just getting started.",
          price: 29,
          interval: "month",
          features: [
            "Up to 10 active booking links",
            "Basic customer management",
            "Standard email notifications",
            "Basic analytics dashboard",
          ],
          isPopular: false,
        },
        {
          id: "pro-plan",
          name: "Professional",
          description: "Advanced features for growing yard card businesses.",
          price: 79,
          interval: "month",
          features: [
            "Unlimited booking links",
            "Advanced customer management",
            "Custom email templates",
            "Detailed analytics and reporting",
            "Priority support",
          ],
          isPopular: true,
        },
        {
          id: "enterprise-plan",
          name: "Enterprise",
          description:
            "Complete solution for established yard card businesses.",
          price: 199,
          interval: "month",
          features: [
            "Everything in Professional",
            "White-label booking pages",
            "API access",
            "Dedicated account manager",
            "Custom integrations",
            "24/7 premium support",
          ],
          isPopular: false,
        },
      ],
    });
  }

  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe API key is not configured" },
        { status: 500 },
      );
    }

    // Fetch all active products
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Format the products with their prices
    const plans = products.data.map((product) => {
      const price = product.default_price as Stripe.Price;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        interval: price.recurring?.interval,
        features: product.features?.map((feature) => feature.name) || [],
        metadata: product.metadata,
        isPopular: product.metadata.popular === "true",
      };
    });

    // Sort plans by price
    plans.sort((a, b) => a.price - b.price);

    return NextResponse.json({ plans });
  } catch (error: any) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch plans" },
      { status: 500 },
    );
  }
}
