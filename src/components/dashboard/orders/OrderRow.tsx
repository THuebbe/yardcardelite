import React, { useState } from "react";
import {
  Printer,
  History,
  CheckCircle,
  XCircle,
  RefreshCw,
  ClipboardCheck,
  ClipboardList,
  Loader2,
} from "lucide-react";
import {
  generatePickTicket,
  generateOrderSummary,
  generatePickupChecklist,
  getOrderReports,
} from "@/lib/reports";
import { Order, User, OrderStatus } from "@/lib/types";

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
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState(order.reports || []);

  // Fetch reports when needed
  const fetchReports = async () => {
    try {
      const fetchedReports = await getOrderReports(order.id);
      setReports(fetchedReports);
      return fetchedReports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintPickTicket = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!order.previewSlots || !order.eventDate) {
      alert(
        "This order is missing required data for a pick ticket. Please ensure it has preview slots and an event date.",
      );
      return;
    }

    try {
      setIsLoading(true);
      await generatePickTicket(order);

      // Fetch updated reports after generating a new one
      await fetchReports();

      // Update order status to processing after printing pick ticket
      if (order.status === "pending") {
        try {
          await updateOrderStatus(order.id, "processing");
          alert(`Order ${order.id} status updated to Processing`);
          // Refresh the order list
          window.location.reload();
        } catch (error) {
          alert(
            `Failed to update order status: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    } catch (error) {
      console.error("Error generating pick ticket:", error);
      alert("There was an error generating the pick ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintOrderSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!order.previewSlots || !order.eventDate) {
      alert(
        "This order is missing required data for an order summary. Please ensure it has preview slots and an event date.",
      );
      return;
    }

    try {
      setIsLoading(true);
      await generateOrderSummary(order);

      // Fetch updated reports after generating a new one
      await fetchReports();

      // Update order status to deployed after printing order summary
      if (order.status === "processing") {
        try {
          await updateOrderStatus(order.id, "deployed");
          alert(`Order ${order.id} status updated to Deployed`);
          // Refresh the order list
          window.location.reload();
        } catch (error) {
          alert(
            `Failed to update order status: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    } catch (error) {
      console.error("Error generating order summary:", error);
      alert(
        "There was an error generating the order summary. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintPickupChecklist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!order.previewSlots || !order.eventDate) {
      alert(
        "This order is missing required data for a pickup checklist. Please ensure it has preview slots and an event date.",
      );
      return;
    }

    try {
      setIsLoading(true);
      await generatePickupChecklist(order);

      // Fetch updated reports after generating a new one
      await fetchReports();

      // Update order status to checkin after printing pickup checklist
      if (order.status === "deployed") {
        try {
          await updateOrderStatus(order.id, "checkin");
          alert(`Order ${order.id} status updated to Check-in`);
          // Refresh the order list
          window.location.reload();
        } catch (error) {
          alert(
            `Failed to update order status: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    } catch (error) {
      console.error("Error generating pickup checklist:", error);
      alert(
        "There was an error generating the pickup checklist. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkCompleted = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Mark this order as completed?")) {
      try {
        await updateOrderStatus(order.id, "completed");
        alert(`Order ${order.id} marked as completed`);
        // Refresh the order list
        window.location.reload();
      } catch (error) {
        alert(
          `Failed to update order status: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  };

  const handleCancelOrder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await updateOrderStatus(order.id, "cancelled");
        alert(`Order ${order.id} has been cancelled`);
        // Refresh the order list
        window.location.reload();
      } catch (error) {
        alert(
          `Failed to cancel order: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  };

  const handleResetOrderStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Reset this order to Pending status? This is for testing purposes only.",
      )
    ) {
      try {
        await updateOrderStatus(order.id, "pending");
        alert(`Order ${order.id} has been reset to pending status`);
        // Refresh the order list
        window.location.reload();
      } catch (error) {
        alert(
          `Failed to reset order status: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
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
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A"}
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
          {order.status
            ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
            : "Unknown"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-3">
          {order.status === "pending" && (
            <button
              onClick={handlePrintPickTicket}
              className="text-blue-600 hover:text-blue-900 group relative"
              title="Print Pick Ticket"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Printer className="h-5 w-5" />
              )}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Printer className="h-5 w-5" />
              )}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ClipboardCheck className="h-5 w-5" />
                )}
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

          {reports.length > 0 && (
            <button
              onClick={(e) => toggleReportHistory(order.id, e)}
              className="text-gray-600 hover:text-blue-900 group relative"
              title="Report History"
            >
              <History className="h-5 w-5" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Report History ({reports.length})
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
