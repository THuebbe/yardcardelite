"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  interval?: string;
}

// Fallback plans in case API fails
const fallbackPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description:
      "Essential tools for yard card businesses just getting started.",
    features: [
      "Up to 10 active booking links",
      "Basic customer management",
      "Standard email notifications",
      "Basic analytics dashboard",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    description: "Advanced features for growing yard card businesses.",
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
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    description: "Complete solution for established yard card businesses.",
    features: [
      "Everything in Professional",
      "White-label booking pages",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "24/7 premium support",
    ],
  },
];

export function PricingTable() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plans, setPlans] = useState<PricingPlan[]>(fallbackPlans);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch("/api/stripe/get-plans");

        if (!response.ok) {
          console.warn(
            `Failed to fetch plans: ${response.status} ${response.statusText}`,
          );
          // Continue with fallback plans
          return;
        }

        const data = await response.json();
        if (data.plans && data.plans.length > 0) {
          console.log("Successfully loaded plans from API", data.plans);
          setPlans(data.plans);
        } else {
          console.warn("API returned no plans, using fallback plans");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(
          "Failed to load subscription plans. Using default plans instead.",
        );
        // Fallback to default plans already set
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login?redirect=/dashboard";
      return;
    }

    setIsLoading(planId);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error initiating subscription:", error);
      setError("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  if (isLoadingPlans) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-md text-center mb-10">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="mt-4 text-muted-foreground">
          Select the perfect plan to grow your yard card business
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${plan.isPopular ? "border-primary shadow-lg" : ""}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">
                  /{plan.interval || "month"}
                </span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.isPopular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading === plan.id}
              >
                {isLoading === plan.id ? "Processing..." : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
