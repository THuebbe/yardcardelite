import React from "react";
import { FormStep } from "@/lib/types";

interface FormHeaderProps {
  currentStep: FormStep;
}

const FormHeader: React.FC<FormHeaderProps> = ({ currentStep }) => {
  const getTitle = () => {
    switch (currentStep) {
      case "customerInfo":
        return "Customer Information";
      case "eventDetails":
        return "Event Details";
      case "signCustomization":
        return "Sign Customization";
      case "payment":
        return "Payment Information";
      case "review":
        return "Review Your Order";
      case "confirmation":
        return "Order Confirmation";
      default:
        return "Yard Sign Rental";
    }
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-border">
      <h1 className="text-2xl font-bold text-center">{getTitle()}</h1>
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "customerInfo" || currentStep === "eventDetails" || currentStep === "signCustomization" || currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 ${currentStep === "eventDetails" || currentStep === "signCustomization" || currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "eventDetails" || currentStep === "signCustomization" || currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
          <div
            className={`w-16 h-1 ${currentStep === "signCustomization" || currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "signCustomization" || currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            3
          </div>
          <div
            className={`w-16 h-1 ${currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment" || currentStep === "review" || currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            4
          </div>
          <div
            className={`w-16 h-1 ${currentStep === "review" || currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "review" || currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            5
          </div>
          <div
            className={`w-16 h-1 ${currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            6
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
