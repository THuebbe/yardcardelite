"use client";

import React, { useState, useEffect } from "react";
import { OrdersTab } from "@/components/dashboard/orders/OrdersTab";
import { Order, User } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/contexts/UserContext";

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

  // Get user ID from context
  const {
    userId,
    userEmail,
    isLoading: userLoading,
    error: userError,
  } = useUser();
  console.log(
    "UserContext in orders page - userId:",
    userId,
    "email:",
    userEmail,
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Wait for user context to be ready
        if (userLoading) {
          return; // Will try again when userLoading changes
        }

        if (userError) {
          throw new Error(`User context error: ${userError}`);
        }

        if (!userId) {
          console.warn(
            "No user ID found in context. User is not authenticated.",
          );
          setError("You must be logged in to view orders. Please sign in.");
          setLoading(false);
          return;
        }

        console.log("Using user ID from context:", userId);

        // Create a new Supabase client for this specific query
        const supabase = createClient();

        // Force using Robert's ID for testing
        const robertId = "97e322b1-0028-4acb-ad14-e81069a6772d";
        console.log("Using Robert's ID for query:", robertId);

        // Query orders with Robert's ID
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id, order_number, user_id, status, total_amount, created_at, updated_at, event_date, event_for_name, package_info, preview_slots, options, pickup_info",
          )
          .eq("user_id", robertId)
          .order("created_at", { ascending: false });

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          throw new Error(`Error fetching orders: ${ordersError.message}`);
        }

        console.log("Raw orders data:", ordersData);

        // Fetch users
        console.log("Fetching users data...");
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*");

        if (usersError) {
          console.error("Error fetching users:", usersError);
          throw new Error(`Error fetching users: ${usersError.message}`);
        }

        console.log("Raw users data:", usersData);

        // Check if we have any data
        console.log("Orders data length:", ordersData?.length || 0);

        // Transform users data first
        const transformedUsers: User[] = usersData
          ? usersData.map((user: any) => ({
              id: user.id,
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              role: user.role || "customer",
              createdAt: user.created_at || new Date().toISOString(),
              updatedAt: user.updated_at || new Date().toISOString(),
            }))
          : [];

        setCustomers(transformedUsers);

        if (!ordersData || ordersData.length === 0) {
          console.warn("No orders data returned from Supabase");
          setOrders([]);
          return;
        }

        // Transform the data to match our application's types
        const transformedOrders: Order[] = ordersData.map((order: any) => {
          // Find the customer for this order
          const customer = usersData?.find(
            (user: any) => user.id === order.user_id,
          );

          // Debug each order
          console.log(`Processing order ${order.id}:`, {
            orderId: order.id,
            userId: order.user_id,
            status: order.status,
            customerId: customer?.id,
          });

          return {
            id: order.id || "",
            order_number: order.order_number,
            userId: order.user_id || "",
            status: order.status || "pending",
            totalAmount: order.total_amount || 0,
            createdAt: order.created_at || new Date().toISOString(),
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
              eventAddress: {
                street: "",
                city: "",
                state: "",
                zip: "",
              },
            },
          };
        });

        console.log("Transformed orders:", transformedOrders);

        setOrders(transformedOrders);
        setCustomers(transformedUsers);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("Data fetching complete");
      }
    };

    fetchData();
  }, [userId, userLoading, userError]);

  // Add a second useEffect to check the createClient function
  useEffect(() => {
    try {
      const checkClient = () => {
        const supabase = createClient();
      };
      checkClient();
    } catch (err) {
      console.error("Error creating Supabase client:", err);
    }
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
