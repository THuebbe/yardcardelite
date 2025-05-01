import React, { useState, useEffect } from "react";
import { Order, ReportHistory } from "@/lib/types";
import {
  reprintReport,
  generateOrderSummary,
  generatePickTicket,
  generatePickupChecklist,
  getOrderReports,
} from "@/lib/reports";
import { formatPhoneNumber } from "@/lib/utils";
import { Printer, FileText, Clipboard, History, Loader2 } from "lucide-react";
import OrderReportHistory from "./OrderReportHistory";

interface OrderDetailsProps {
  order: Order;
}

// SignPreview component placeholder - replace with your actual component
const SignPreview = ({
  slots,
  onRemoveSign,
  onReorderSlots,
  readOnly,
  eventForName,
}: any) => (
  <div className="bg-gray-100 p-4 rounded border border-gray-200">
    <p className="text-sm text-gray-500">Sign preview placeholder</p>
  </div>
);

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<ReportHistory[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await getOrderReports(order.id);
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [order.id]);

  const handleGenerateOrderSummary = async () => {
    try {
      setIsLoading(true);
      await generateOrderSummary(order);
      // Refresh reports after generating a new one
      const updatedReports = await getOrderReports(order.id);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error generating order summary:", error);
      alert(
        "There was an error generating the order summary. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePickTicket = async () => {
    try {
      setIsLoading(true);
      await generatePickTicket(order);
      // Refresh reports after generating a new one
      const updatedReports = await getOrderReports(order.id);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error generating pick ticket:", error);
      alert("There was an error generating the pick ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePickupChecklist = async () => {
    try {
      setIsLoading(true);
      await generatePickupChecklist(order);
      // Refresh reports after generating a new one
      const updatedReports = await getOrderReports(order.id);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error generating pickup checklist:", error);
      alert(
        "There was an error generating the pickup checklist. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-b-lg border-t border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              Customer Information
            </h4>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                {order.customerInfo?.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {order.customerInfo?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span>{" "}
                {formatPhoneNumber(order.customerInfo?.phone)}
              </p>
            </div>
          </div>

          {/* Event Address */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Event Address</h4>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-sm">
                {order.customerInfo?.eventAddress?.street}
              </p>
              {order.customerInfo?.eventAddress?.apartment && (
                <p className="text-sm">
                  Apt {order.customerInfo.eventAddress.apartment}
                </p>
              )}
              <p className="text-sm">
                {order.customerInfo?.eventAddress?.city},{" "}
                {order.customerInfo?.eventAddress?.state}{" "}
                {order.customerInfo?.eventAddress?.zip}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Event Details</h4>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-sm">
                <span className="font-medium">Date:</span>{" "}
                {order.eventDate
                  ? new Date(order.eventDate).toLocaleDateString()
                  : "Not specified"}
              </p>
              {order.eventForName && (
                <p className="text-sm">
                  <span className="font-medium">For:</span> {order.eventForName}
                </p>
              )}
              {order.packageInfo && (
                <div className="mt-2">
                  <p className="text-sm font-medium">
                    Package: {order.packageInfo.name}
                  </p>
                  <p className="text-sm">
                    Price: ${order.packageInfo.price.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Setup: {order.packageInfo.setupDaysBefore} day(s) before
                  </p>
                  <p className="text-sm">
                    Teardown: {order.packageInfo.teardownDaysAfter} day(s) after
                  </p>
                </div>
              )}
              {order.options && order.packageInfo && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Additional Options:</p>
                  <ul className="list-disc list-inside text-sm pl-2">
                    {order.options.earlyDelivery && (
                      <li>
                        Extra Day Before - $
                        {order.packageInfo.extraDayBeforePrice.toFixed(2)}
                      </li>
                    )}
                    {order.options.latePickup && (
                      <li>
                        Extra Day After - $
                        {order.packageInfo.extraDayAfterPrice.toFixed(2)}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Sign Package Preview */}
          {order.previewSlots && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Sign Package Preview
              </h4>
              <SignPreview
                slots={order.previewSlots}
                onRemoveSign={() => {}}
                onReorderSlots={() => {}}
                readOnly
                eventForName={order.eventForName}
              />
            </div>
          )}

          {/* Sign Details for Fulfillment */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              Signs to Pull for Order
            </h4>
            <div className="bg-white p-3 rounded border border-gray-200">
              {order.previewSlots ? (
                <div className="space-y-2">
                  {order.previewSlots
                    .filter((slot) => slot.sign && !slot.isNameSlot)
                    .map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden mr-3">
                          {slot.sign && (
                            <img
                              src={slot.sign.imageUrl}
                              alt={slot.sign.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Slot {slot.id}: {slot.sign?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {slot.sign?.eventType}, {slot.sign?.style},{" "}
                            {slot.sign?.color}
                          </p>
                        </div>
                      </div>
                    ))}
                  {order.previewSlots.some((slot) => slot.isNameSlot) && (
                    <div className="flex items-center p-2 border-b border-gray-100 last:border-b-0 bg-blue-50">
                      <div className="w-8 h-8 bg-blue-600 rounded overflow-hidden mr-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          Name
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Name Sign</p>
                        <p className="text-xs text-gray-500">
                          For: {order.eventForName || "Customer"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No sign details available
                </p>
              )}
            </div>
          </div>

          {/* Generate Reports Section */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Generate Reports</h4>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGenerateOrderSummary}
                  className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Order Summary
                </button>
                <button
                  onClick={handleGeneratePickTicket}
                  className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Printer className="h-4 w-4 mr-2" />
                  )}
                  Pick Ticket
                </button>
                <button
                  onClick={handleGeneratePickupChecklist}
                  className="flex items-center px-3 py-2 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Clipboard className="h-4 w-4 mr-2" />
                  )}
                  Pickup Checklist
                </button>
              </div>
            </div>
          </div>

          {/* Reports History Section */}
          <OrderReportHistory order={{ ...order, reports }} />
        </div>
      </div>
    </div>
  );
};
