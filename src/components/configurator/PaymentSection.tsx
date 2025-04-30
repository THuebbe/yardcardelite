import React from "react";
import { PaymentInfo } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentSectionProps {
  paymentInfo: PaymentInfo;
  onPaymentInfoChange: (info: Partial<PaymentInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentInfo,
  onPaymentInfoChange,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handlePaymentMethodChange = (value: string) => {
    onPaymentInfoChange({ paymentMethod: value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-border"
    >
      <h3 className="text-lg font-medium mb-4">Payment Information</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup
            value={paymentInfo.paymentMethod || "Credit Card"}
            onValueChange={handlePaymentMethodChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Credit Card" id="credit-card" />
              <Label htmlFor="credit-card" className="cursor-pointer">
                Credit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PayPal" id="paypal" />
              <Label htmlFor="paypal" className="cursor-pointer">
                PayPal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Apple Pay" id="apple-pay" />
              <Label htmlFor="apple-pay" className="cursor-pointer">
                Apple Pay
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Venmo" id="venmo" />
              <Label htmlFor="venmo" className="cursor-pointer">
                Venmo
              </Label>
            </div>
          </RadioGroup>
        </div>

        {(paymentInfo.paymentMethod === "Credit Card" ||
          !paymentInfo.paymentMethod) && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={paymentInfo.cardNumber || ""}
                  onChange={(e) =>
                    onPaymentInfoChange({ cardNumber: e.target.value })
                  }
                  placeholder="**** **** **** ****"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiration Date</Label>
                <Input
                  id="cardExpiry"
                  value={paymentInfo.cardExpiry || ""}
                  onChange={(e) =>
                    onPaymentInfoChange({ cardExpiry: e.target.value })
                  }
                  placeholder="MM/YY"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Billing Address</Label>
              <Input
                id="street"
                value={paymentInfo.street || ""}
                onChange={(e) =>
                  onPaymentInfoChange({ street: e.target.value })
                }
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={paymentInfo.city || ""}
                  onChange={(e) =>
                    onPaymentInfoChange({ city: e.target.value })
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={paymentInfo.state || ""}
                  onChange={(e) =>
                    onPaymentInfoChange({ state: e.target.value })
                  }
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={paymentInfo.zip || ""}
                  onChange={(e) => onPaymentInfoChange({ zip: e.target.value })}
                  placeholder="ZIP Code"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default PaymentSection;
