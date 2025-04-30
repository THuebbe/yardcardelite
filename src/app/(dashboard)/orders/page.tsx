"use client";

import React, { useState } from "react";
import { OrdersTab } from "@/components/dashboard/orders/OrdersTab";
import { Order, User } from "@/lib/types";

export default function OrdersPage() {
  // Mock data - in a real app, this would come from an API or database
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD12345",
      userId: "user1",
      customerInfo: {
        name: "John Doe",
        email: "john@example.com",
        phone: "5551234567",
      },
      status: "pending",
      totalAmount: 249.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    },
    {
      id: "ORD67890",
      userId: "user2",
      customerInfo: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "5559876543",
      },
      status: "processing",
      totalAmount: 349.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    },
    {
      id: "ORD24680",
      userId: "user3",
      customerInfo: {
        name: "Robert Johnson",
        email: "robert@example.com",
        phone: "5552468101",
      },
      status: "deployed",
      totalAmount: 499.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ]);

  const [customers, setCustomers] = useState<User[]>([
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      phone: "5551234567",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "5559876543",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user3",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "5552468101",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | "customerName";
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const handleSort = (key: keyof Order | "customerName") => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <OrdersTab
        orders={orders}
        customers={customers}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        sortConfig={sortConfig}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onSort={handleSort}
      />
    </div>
  );
}
