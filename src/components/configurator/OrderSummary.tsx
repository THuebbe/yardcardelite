import React from "react";
import { OrderData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface OrderSummaryProps {
  orderData: OrderData;
  onSubmit: () => void;
  onBack: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderData,
  onSubmit,
  onBack,
}) => {
  const {
    customerInfo,
    eventDetails,
    signCustomization,
    paymentInfo,
    totalPrice,
  } = orderData;

  const getInstallationTimeText = () => {
    switch (eventDetails.installationTime) {
      case "morning":
        return "Morning (8AM - 12PM)";
      case "afternoon":
        return "Afternoon (12PM - 4PM)";
      case "evening":
        return "Evening (4PM - 7PM)";
      default:
        return eventDetails.installationTime;
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-xl font-semibold">Order Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium">Customer Information</h4>
            <div className="grid grid-cols-[120px_1fr] gap-1 mt-2">
              <div className="text-muted-foreground">Name:</div>
              <div>{customerInfo.name}</div>
              <div className="text-muted-foreground">Email:</div>
              <div>{customerInfo.email}</div>
              <div className="text-muted-foreground">Phone:</div>
              <div>{customerInfo.phone}</div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium">Billing Information</h4>
            <div className="grid grid-cols-[120px_1fr] gap-1 mt-2">
              <div className="text-muted-foreground">Payment Method:</div>
              <div>{paymentInfo.paymentMethod || "Credit Card"}</div>

              {paymentInfo.paymentMethod === "Credit Card" && (
                <>
                  <div className="text-muted-foreground">Card Number:</div>
                  <div>{paymentInfo.cardNumber || "**** **** **** 1234"}</div>
                  <div className="text-muted-foreground">Expiration:</div>
                  <div>{paymentInfo.cardExpiry || "12/25"}</div>
                </>
              )}

              {(paymentInfo.paymentMethod === "Credit Card" ||
                !paymentInfo.paymentMethod) && (
                <>
                  <div className="text-muted-foreground">Billing Address:</div>
                  <div>
                    {paymentInfo.street}, {paymentInfo.city},{" "}
                    {paymentInfo.state} {paymentInfo.zip}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium">Event Details</h4>
            <div className="grid grid-cols-[120px_1fr] gap-1 mt-2">
              <div className="text-muted-foreground">Event Date:</div>
              <div>
                {eventDetails.eventDate
                  ? format(eventDetails.eventDate, "PPP")
                  : "Not specified"}
              </div>
              <div className="text-muted-foreground">Duration:</div>
              <div>{eventDetails.eventDuration} days</div>
              <div className="text-muted-foreground">Delivery Address:</div>
              <div>
                {eventDetails.street}, {eventDetails.city}, {eventDetails.state}{" "}
                {eventDetails.zip}
              </div>
              <div className="text-muted-foreground">Installation Time:</div>
              <div>{getInstallationTimeText()}</div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium">Sign Details</h4>
            <div className="grid grid-cols-[120px_1fr] gap-1 mt-2">
              <div className="text-muted-foreground">Sign Text:</div>
              <div>{signCustomization.text}</div>
              <div className="text-muted-foreground">Message Color:</div>
              <div className="capitalize">
                {signCustomization.backgroundColor}
              </div>
              <div className="text-muted-foreground">Name Color:</div>
              <div className="capitalize">{signCustomization.textColor}</div>

              {signCustomization.extraDaysBefore > 0 && (
                <>
                  <div className="text-muted-foreground">
                    Extra Days Before:
                  </div>
                  <div>{signCustomization.extraDaysBefore} day(s)</div>
                </>
              )}

              {signCustomization.extraDaysAfter > 0 && (
                <>
                  <div className="text-muted-foreground">Extra Days After:</div>
                  <div>{signCustomization.extraDaysAfter} day(s)</div>
                </>
              )}

              {signCustomization.hobbies &&
                signCustomization.hobbies.length > 0 && (
                  <>
                    <div className="text-muted-foreground">
                      Hobbies/Interests:
                    </div>
                    <div>
                      <ul className="list-disc list-inside">
                        {signCustomization.hobbies.map((hobby) => (
                          <li key={hobby} className="capitalize">
                            {hobby}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit}>Submit Order</Button>
      </div>
    </div>
  );
};

export default OrderSummary;
