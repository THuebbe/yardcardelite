import React, { useMemo } from "react";
import { SignCustomization, EventDetails } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PricingCalculatorProps {
  signCustomization: SignCustomization;
  eventDetails: EventDetails;
  onTotalPriceChange: (price: number) => void;
  extraDaysBefore: number;
  extraDaysAfter: number;
  onExtraDaysBeforeChange: (value: number) => void;
  onExtraDaysAfterChange: (value: number) => void;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  signCustomization,
  eventDetails,
  onTotalPriceChange,
  extraDaysBefore,
  extraDaysAfter,
  onExtraDaysBeforeChange,
  onExtraDaysAfterChange,
}) => {
  const basePrice = 95; // Base price for letter sign package

  const totalPrice = useMemo(() => {
    // Start with base price
    let price = basePrice;

    // Add extra days before (if any)
    if (extraDaysBefore > 0) {
      price += extraDaysBefore * 10;
    }

    // Add extra days after (if any)
    if (extraDaysAfter > 0) {
      price += extraDaysAfter * 10;
    }

    // Update parent component with the total price
    onTotalPriceChange(price);

    return price;
  }, [extraDaysBefore, extraDaysAfter, basePrice, onTotalPriceChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-medium mb-4">Pricing Details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Package:</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Event Date:</span>
            <span>
              {eventDetails.eventDate
                ? new Date(eventDetails.eventDate).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Additional Options</Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="extraDaysBefore" className="font-normal">
                  Extra Days Before (+$10 per day)
                </Label>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      onExtraDaysBeforeChange(Math.max(0, extraDaysBefore - 1))
                    }
                    disabled={extraDaysBefore <= 0}
                  >
                    -
                  </Button>
                  <span className="w-6 text-center">{extraDaysBefore}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      onExtraDaysBeforeChange(Math.min(3, extraDaysBefore + 1))
                    }
                    disabled={extraDaysBefore >= 3}
                  >
                    +
                  </Button>
                </div>
              </div>
              {extraDaysBefore > 0 && (
                <div className="text-sm text-muted-foreground">
                  +${(extraDaysBefore * 10).toFixed(2)} ({extraDaysBefore} day
                  {extraDaysBefore !== 1 ? "s" : ""})
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="extraDaysAfter" className="font-normal">
                  Extra Days After (+$10 per day)
                </Label>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      onExtraDaysAfterChange(Math.max(0, extraDaysAfter - 1))
                    }
                    disabled={extraDaysAfter <= 0}
                  >
                    -
                  </Button>
                  <span className="w-6 text-center">{extraDaysAfter}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      onExtraDaysAfterChange(Math.min(3, extraDaysAfter + 1))
                    }
                    disabled={extraDaysAfter >= 3}
                  >
                    +
                  </Button>
                </div>
              </div>
              {extraDaysAfter > 0 && (
                <div className="text-sm text-muted-foreground">
                  +${(extraDaysAfter * 10).toFixed(2)} ({extraDaysAfter} day
                  {extraDaysAfter !== 1 ? "s" : ""})
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
