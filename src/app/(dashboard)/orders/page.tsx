"use client";

import React, { useState, useEffect } from "react";
import { OrdersTab } from "@/components/dashboard/orders/OrdersTab";
import { Order, User } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | "customerName";
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*");

        if (ordersError)
          throw new Error(`Error fetching orders: ${ordersError.message}`);

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*");

        if (usersError)
          throw new Error(`Error fetching users: ${usersError.message}`);

        // Transform the data to match our application's types
        const transformedOrders: Order[] = ordersData.map((order: any) => {
          // Find the customer for this order
          const customer = usersData.find(
            (user: any) => user.id === order.user_id,
          );

          return {
            id: order.id,
            userId: order.user_id,
            status: order.status,
            totalAmount: order.total_amount,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            eventDate: order.event_date,
            eventForName: order.event_for_name,
            packageInfo: order.package_info,
            previewSlots: order.preview_slots,
            options: order.options,
            customerInfo: {
              name: customer?.name || "",
              email: customer?.email || "",
              phone: customer?.phone || "",
              eventAddress: order.event_address || {
                street: "",
                city: "",
                state: "",
                zip: "",
              },
            },
          };
        });

        const transformedUsers: User[] = usersData.map((user: any) => ({
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "customer",
          createdAt: user.created_at || new Date().toISOString(),
          updatedAt: user.updated_at || new Date().toISOString(),
        }));

        setOrders(transformedOrders);
        setCustomers(transformedUsers);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof Order | "customerName") => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Orders</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Orders</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

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
