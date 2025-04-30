import React from "react";
import { OrderData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface ConfirmationMessageProps {
  orderData: OrderData;
  orderNumber: string;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({
  orderData,
  orderNumber,
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-border text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold">Thank You for Your Order!</h2>
      <p className="text-lg">Your yard sign rental has been confirmed.</p>
      <div className="bg-muted p-4 rounded-md inline-block mx-auto">
        <p className="font-medium">Order Number: {orderNumber}</p>
      </div>

      <div className="text-left max-w-md mx-auto space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Order Details</h3>
          <p>
            We'll deliver your sign on{" "}
            {orderData.eventDetails.eventDate
              ? format(orderData.eventDetails.eventDate, "PPPP")
              : "the specified date"}
            .
          </p>
          <p>
            A confirmation email has been sent to {orderData.customerInfo.email}
            .
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">What's Next?</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Our team will review your order</li>
            <li>We'll contact you to confirm installation details</li>
            <li>
              Your sign will be prepared and delivered on the scheduled date
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={() => (window.location.href = "/")}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
