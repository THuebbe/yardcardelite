"use client";

import React, { useState } from "react";
import {
  CustomerInfo,
  EventDetails,
  SignCustomization,
  PaymentInfo,
  OrderData,
  FormStep,
} from "@/lib/types";
import CustomerInfoSection from "./CustomerInfoSection";
import EventDetailsSection from "./EventDetailsSection";
import SignCustomizationSection from "./SignCustomizationSection";
import PricingCalculator from "./PricingCalculator";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";
import ConfirmationMessage from "./ConfirmationMessage";
import FormHeader from "./FormHeader";
import SignPreview from "./SignPreview";
import "@/app/configurator.css";

const MultiStepFormContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>("customerInfo");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: "Credit Card",
    street: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
  });
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventDate: undefined,
    eventDuration: 1,
    street: "",
    city: "",
    state: "",
    zip: "",
    installationTime: "morning",
  });
  const [signCustomization, setSignCustomization] = useState<SignCustomization>(
    {
      text: "",
      backgroundColor: "white",
      textColor: "black",
      extraDaysBefore: 0,
      extraDaysAfter: 0,
      eventMessage: "",
      recipientName: "",
      hobbies: [],
    },
  );
  const [totalPrice, setTotalPrice] = useState<number>(95);
  const [orderNumber, setOrderNumber] = useState<string>("");

  const handleCustomerInfoChange = (info: Partial<CustomerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  const handlePaymentInfoChange = (info: Partial<PaymentInfo>) => {
    setPaymentInfo((prev) => ({ ...prev, ...info }));
  };

  const handleEventDetailsChange = (details: Partial<EventDetails>) => {
    setEventDetails((prev) => ({ ...prev, ...details }));
  };

  const handleSignCustomizationChange = (
    customization: Partial<SignCustomization>,
  ) => {
    setSignCustomization((prev) => ({ ...prev, ...customization }));
  };

  const handleTotalPriceChange = (price: number) => {
    setTotalPrice(price);
  };

  const handleSubmitOrder = () => {
    // Generate a random order number
    const randomOrderNumber = `YS-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrderNumber);

    // In a real application, you would submit the order to a backend here
    // For now, we'll just move to the confirmation step
    setCurrentStep("confirmation");
  };

  const orderData: OrderData = {
    customerInfo,
    eventDetails,
    signCustomization,
    paymentInfo,
    totalPrice,
  };

  return (
    <div className="configurator-theme max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <FormHeader currentStep={currentStep} />

      <div className="mt-6">
        {currentStep === "customerInfo" && (
          <CustomerInfoSection
            customerInfo={customerInfo}
            onCustomerInfoChange={handleCustomerInfoChange}
            onNext={() => setCurrentStep("eventDetails")}
          />
        )}

        {currentStep === "eventDetails" && (
          <EventDetailsSection
            eventDetails={eventDetails}
            onEventDetailsChange={handleEventDetailsChange}
            onNext={() => setCurrentStep("signCustomization")}
            onBack={() => setCurrentStep("customerInfo")}
          />
        )}

        {currentStep === "signCustomization" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SignCustomizationSection
                signCustomization={signCustomization}
                onSignCustomizationChange={handleSignCustomizationChange}
                onNext={() => setCurrentStep("payment")}
                onBack={() => setCurrentStep("eventDetails")}
              />
            </div>
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <SignPreview signCustomization={signCustomization} />
              <PricingCalculator
                signCustomization={signCustomization}
                eventDetails={eventDetails}
                onTotalPriceChange={handleTotalPriceChange}
                extraDaysBefore={signCustomization.extraDaysBefore}
                extraDaysAfter={signCustomization.extraDaysAfter}
                onExtraDaysBeforeChange={(value) =>
                  handleSignCustomizationChange({ extraDaysBefore: value })
                }
                onExtraDaysAfterChange={(value) =>
                  handleSignCustomizationChange({ extraDaysAfter: value })
                }
              />
            </div>
          </div>
        )}

        {currentStep === "payment" && (
          <PaymentSection
            paymentInfo={paymentInfo}
            onPaymentInfoChange={handlePaymentInfoChange}
            onNext={() => setCurrentStep("review")}
            onBack={() => setCurrentStep("signCustomization")}
          />
        )}

        {currentStep === "review" && (
          <OrderSummary
            orderData={orderData}
            onSubmit={handleSubmitOrder}
            onBack={() => setCurrentStep("payment")}
          />
        )}

        {currentStep === "confirmation" && (
          <ConfirmationMessage
            orderData={orderData}
            orderNumber={orderNumber}
          />
        )}
      </div>
    </div>
  );
};

// Helper function to get the step number based on the current step
function getStepNumber(step: FormStep): number {
  const steps: FormStep[] = [
    "customerInfo",
    "eventDetails",
    "signCustomization",
    "payment",
    "review",
  ];
  return steps.indexOf(step) + 1;
}

export default MultiStepFormContainer;
