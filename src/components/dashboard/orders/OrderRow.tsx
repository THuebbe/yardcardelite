import React from "react";
import {
  Printer,
  History,
  CheckCircle,
  XCircle,
  RefreshCw,
  ClipboardCheck,
  ClipboardList,
} from "lucide-react";
import { Order, User } from "@/lib/types";

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  showCheckIn: boolean;
  getCustomerById: (userId: string) => User | undefined;
  toggleOrderExpansion: (orderId: string) => void;
  toggleReportHistory: (orderId: string, e: React.MouseEvent) => void;
  toggleCheckIn: (orderId: string, e: React.MouseEvent) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  order,
  isExpanded,
  showCheckIn,
  getCustomerById,
  toggleOrderExpansion,
  toggleReportHistory,
  toggleCheckIn,
}) => {
  // Placeholder for order reports functionality
  const orderReports = order.reports || [];

  const handlePrintPickTicket = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!order.previewSlots || !order.eventDate) {
      alert(
        "This order is missing required data for a pick ticket. Please ensure it has preview slots and an event date.",
      );
      return;
    }

    // Placeholder for actual functionality
    alert("Printing pick ticket for order " + order.id);
  };

  const handlePrintOrderSummary = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!order.previewSlots || !order.eventDate) {
      alert(
        "This order is missing required data for an order summary. Please ensure it has preview slots and an event date.",
      );
      return;
    }

    // Placeholder for actual functionality
    alert("Printing order summary for order " + order.id);
  };

  const handlePrintPickupChecklist = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!order.previewSlots || !order.eventDate) {
      alert(
        "This order is missing required data for a pickup checklist. Please ensure it has preview slots and an event date.",
      );
      return;
    }

    // Placeholder for actual functionality
    alert("Printing pickup checklist for order " + order.id);
  };

  const handleMarkCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Mark this order as completed?")) {
      // Placeholder for actual functionality
      alert("Order " + order.id + " marked as completed");
    }
  };

  const handleCancelOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this order?")) {
      // Placeholder for actual functionality
      alert("Order " + order.id + " cancelled");
    }
  };

  const handleResetOrderStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Reset this order to Pending status? This is for testing purposes only.",
      )
    ) {
      // Placeholder for actual functionality
      alert("Order " + order.id + " reset to pending status");
    }
  };

  return (
    <tr
      className={`hover:bg-gray-50 ${isExpanded || showCheckIn ? "bg-gray-50" : ""}`}
      onClick={() => toggleOrderExpansion(order.id)}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{order.id.substring(0, 8)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {order.customerInfo?.name ||
          getCustomerById(order.userId)?.name ||
          "Unknown"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.status === "completed"
              ? "bg-green-100 text-green-800"
              : order.status === "processing"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "deployed"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "checkin"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "pending"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${order.totalAmount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-3">
          {order.status === "pending" && (
            <button
              onClick={handlePrintPickTicket}
              className="text-blue-600 hover:text-blue-900 group relative"
              title="Print Pick Ticket"
            >
              <Printer className="h-5 w-5" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Print Pick Ticket
              </span>
            </button>
          )}

          {order.status === "processing" && (
            <button
              onClick={handlePrintOrderSummary}
              className="text-blue-600 hover:text-blue-900 group relative"
              title="Print Order Summary"
            >
              <Printer className="h-5 w-5" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Print Order Summary
              </span>
            </button>
          )}

          {order.status === "deployed" && (
            <>
              <button
                onClick={handlePrintPickupChecklist}
                className="text-blue-600 hover:text-blue-900 group relative"
                title="Print Pickup Checklist"
              >
                <ClipboardCheck className="h-5 w-5" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Print Pickup Checklist
                </span>
              </button>
              <button
                onClick={(e) => toggleCheckIn(order.id, e)}
                className="text-purple-600 hover:text-purple-900 group relative"
                title="Check In Signs"
              >
                <ClipboardList className="h-5 w-5" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Check In Signs
                </span>
              </button>
            </>
          )}

          {orderReports.length > 0 && (
            <button
              onClick={(e) => toggleReportHistory(order.id, e)}
              className="text-gray-600 hover:text-blue-900 group relative"
              title="Report History"
            >
              <History className="h-5 w-5" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Report History ({orderReports.length})
              </span>
            </button>
          )}

          {order.status === "checkin" && (
            <button
              onClick={handleMarkCompleted}
              className="text-green-600 hover:text-green-900 group relative"
              title="Mark as Completed"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Mark as Completed
              </span>
            </button>
          )}

          {(order.status === "pending" ||
            order.status === "processing" ||
            order.status === "deployed") && (
            <button
              onClick={handleCancelOrder}
              className="text-red-600 hover:text-red-900 group relative"
              title="Cancel Order"
            >
              <XCircle className="h-5 w-5" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Cancel Order
              </span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleOrderExpansion(order.id);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
        </div>
      </td>
    </tr>
  );
};
