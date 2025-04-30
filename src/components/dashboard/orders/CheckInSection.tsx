import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Order } from "@/lib/types";
import { SignCondition, PickupInfo, savePickupInfo } from "@/lib/reports";

interface CheckInSectionProps {
  order: Order;
  onComplete: () => void;
}

// Extended PreviewSlot type to match what's used in the component
interface PreviewSlot {
  id: string;
  isNameSlot?: boolean;
  sign?: {
    id: string;
    name: string;
    imageUrl: string;
    eventType: string;
    style: string;
  };
}

// Extended Order type with additional properties used in the component
interface ExtendedOrder extends Order {
  previewSlots?: PreviewSlot[];
  packageInfo?: {
    teardownDaysAfter: number;
    extraDayAfterPrice: number;
  };
  options?: {
    latePickup?: boolean;
  };
}

export const CheckInSection: React.FC<CheckInSectionProps> = ({
  order,
  onComplete,
}) => {
  const extendedOrder = order as ExtendedOrder;
  const [pickupDate, setPickupDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [signConditions, setSignConditions] = useState<SignCondition[]>([]);
  const [notes, setNotes] = useState("");
  const [lateFee, setLateFee] = useState(0);

  useEffect(() => {
    if (extendedOrder.previewSlots) {
      const initialConditions = extendedOrder.previewSlots
        .filter((slot) => slot.sign && !slot.isNameSlot)
        .map((slot) => ({
          signId: slot.sign!.id,
          condition: "good" as const,
        }));
      setSignConditions(initialConditions);
    }
  }, [extendedOrder]);

  useEffect(() => {
    if (extendedOrder.packageInfo && extendedOrder.eventDate) {
      const scheduledPickupDate = new Date(extendedOrder.eventDate);
      scheduledPickupDate.setDate(
        scheduledPickupDate.getDate() +
          extendedOrder.packageInfo.teardownDaysAfter +
          (extendedOrder.options?.latePickup ? 1 : 0),
      );

      const actualPickupDate = new Date(pickupDate);
      const daysLate = Math.max(
        0,
        Math.floor(
          (actualPickupDate.getTime() - scheduledPickupDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );

      if (daysLate > 0) {
        setLateFee(daysLate * extendedOrder.packageInfo.extraDayAfterPrice);
      } else {
        setLateFee(0);
      }
    }
  }, [pickupDate, extendedOrder]);

  const handleToggleCondition = (signId: string) => {
    setSignConditions((prev) =>
      prev.map((condition) =>
        condition.signId === signId
          ? {
              ...condition,
              condition: condition.condition === "good" ? "damaged" : "good",
            }
          : condition,
      ),
    );
  };

  const handleSubmit = () => {
    const pickupInfo: PickupInfo = {
      pickupDate,
      signConditions,
      notes,
      pickedUpOnTime: lateFee === 0,
      lateFee: lateFee > 0 ? lateFee : undefined,
      checkedBy: "Admin", // In a real app, this would be the logged-in admin's name
    };

    savePickupInfo(extendedOrder.id, pickupInfo);
    onComplete();
  };

  return (
    <tr>
      <td colSpan={6} className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Check In Signs</h2>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Date
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Sign Conditions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Sign Conditions</h3>
            <div className="space-y-4">
              {extendedOrder.previewSlots
                ?.filter((slot) => slot.sign && !slot.isNameSlot)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={slot.sign!.imageUrl}
                        alt={slot.sign!.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{slot.sign!.name}</p>
                        <p className="text-sm text-gray-500">
                          {slot.sign!.eventType}, {slot.sign!.style}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleCondition(slot.sign!.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        signConditions.find((c) => c.signId === slot.sign!.id)
                          ?.condition === "good"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          signConditions.find((c) => c.signId === slot.sign!.id)
                            ?.condition === "good"
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter any additional notes about the condition of the signs..."
            />
          </div>

          {/* Late Fee Display */}
          {lateFee > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h4 className="text-red-800 font-medium">Late Fees</h4>
              <p className="text-red-600">
                ${lateFee.toFixed(2)} - Pickup was later than scheduled return
                date
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Check className="mr-2 h-5 w-5" />
              Complete Check In
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};
