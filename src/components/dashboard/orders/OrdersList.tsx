import React from "react";
import { Order, User } from "@/lib/types";
import { OrderRow } from "./OrderRow";
import { OrderDetails } from "./OrderDetails";
import { OrderReportHistory } from "./OrderReportHistory";
import { CheckInSection } from "./CheckInSection";

interface OrdersListProps {
  filteredOrders: Order[];
  customers: User[];
  sortConfig: {
    key: keyof Order | "customerName";
    direction: "asc" | "desc";
  };
  expandedOrderId: string | null;
  showReportHistory: string | null;
  showCheckIn: string | null;
  onSort: (key: keyof Order | "customerName") => void;
  toggleOrderExpansion: (orderId: string) => void;
  toggleReportHistory: (orderId: string, e: React.MouseEvent) => void;
  toggleCheckIn: (orderId: string, e: React.MouseEvent) => void;
  getCustomerById: (userId: string) => User | undefined;
  onCheckInComplete: () => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  filteredOrders,
  customers,
  sortConfig,
  expandedOrderId,
  showReportHistory,
  showCheckIn,
  onSort,
  toggleOrderExpansion,
  toggleReportHistory,
  toggleCheckIn,
  getCustomerById,
  onCheckInComplete,
}) => {
  const getSortIndicator = (key: keyof Order | "customerName") => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("id")}
            >
              Order ID{getSortIndicator("id")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("customerName")}
            >
              Customer{getSortIndicator("customerName")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("createdAt")}
            >
              Date{getSortIndicator("createdAt")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("status")}
            >
              Status{getSortIndicator("status")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("totalAmount")}
            >
              Total{getSortIndicator("totalAmount")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No orders found matching your criteria.
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <OrderRow
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  showCheckIn={showCheckIn === order.id}
                  getCustomerById={getCustomerById}
                  toggleOrderExpansion={toggleOrderExpansion}
                  toggleReportHistory={toggleReportHistory}
                  toggleCheckIn={toggleCheckIn}
                />
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <OrderDetails order={order} />
                    </td>
                  </tr>
                )}
                {showReportHistory === order.id && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <OrderReportHistory order={order} />
                    </td>
                  </tr>
                )}
                {showCheckIn === order.id && (
                  <CheckInSection
                    order={order}
                    onComplete={onCheckInComplete}
                  />
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
