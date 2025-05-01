import React, { useState } from "react";
import { Order, User } from "@/lib/types";
import { OrdersFilter } from "./OrdersFilter";
import { OrdersList } from "./OrdersList";

interface OrdersTabProps {
  orders: Order[];
  customers: User[];
  searchTerm: string;
  statusFilter: string;
  sortConfig: {
    key: keyof Order | "customerName";
    direction: "asc" | "desc";
  };
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSort: (key: keyof Order | "customerName") => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  customers,
  searchTerm,
  statusFilter,
  sortConfig,
  onSearchChange,
  onStatusFilterChange,
  onSort,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showReportHistory, setShowReportHistory] = useState<string | null>(
    null,
  );
  const [showCheckIn, setShowCheckIn] = useState<string | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    // Close report history and check-in if open
    if (showReportHistory === orderId) {
      setShowReportHistory(null);
    }
    if (showCheckIn === orderId) {
      setShowCheckIn(null);
    }
  };

  const toggleReportHistory = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReportHistory(showReportHistory === orderId ? null : orderId);
    // Close other expandable sections
    setExpandedOrderId(null);
    setShowCheckIn(null);
  };

  const toggleCheckIn = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCheckIn(showCheckIn === orderId ? null : orderId);
    // Close other expandable sections
    setExpandedOrderId(null);
    setShowReportHistory(null);
  };

  const handleCheckInComplete = () => {
    setShowCheckIn(null);
    // Reload the page to reflect changes
    window.location.reload();
  };

  const getCustomerById = (userId: string) => {
    return customers.find((customer) => customer.id === userId);
  };

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // Filter by status
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(searchLower);

        // Get customer info either from order.customerInfo or from customers array
        const customer = order.customerInfo?.name
          ? order.customerInfo
          : getCustomerById(order.userId);

        const matchesCustomer =
          customer?.name?.toLowerCase().includes(searchLower) || false;
        const matchesEmail =
          customer?.email?.toLowerCase().includes(searchLower) || false;

        return matchesId || matchesCustomer || matchesEmail;
      }

      return true;
    });
  }, [orders, statusFilter, searchTerm, customers]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <OrdersFilter
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
      />

      <OrdersList
        filteredOrders={filteredOrders}
        customers={customers}
        sortConfig={sortConfig}
        expandedOrderId={expandedOrderId}
        showReportHistory={showReportHistory}
        showCheckIn={showCheckIn}
        onSort={onSort}
        toggleOrderExpansion={toggleOrderExpansion}
        toggleReportHistory={toggleReportHistory}
        toggleCheckIn={toggleCheckIn}
        getCustomerById={getCustomerById}
        onCheckInComplete={handleCheckInComplete}
      />
    </div>
  );
};
