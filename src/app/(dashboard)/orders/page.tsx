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
        eventAddress: {
          street: "123 Main St",
          city: "Austin",
          state: "TX",
          zip: "78701",
        },
      },
      status: "pending",
      totalAmount: 249.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      eventForName: "Sarah's Birthday",
      packageInfo: {
        id: "pkg1",
        name: "Birthday Package",
        price: 249.99,
        signCount: 3,
        setupDaysBefore: 1,
        teardownDaysAfter: 1,
        extraDayBeforePrice: 25,
        extraDayAfterPrice: 25,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      options: {
        earlyDelivery: false,
        latePickup: false,
      },
      previewSlots: [
        {
          id: 1,
          sign: {
            id: "sign1",
            serialNumber: "SN001",
            name: "Happy Birthday",
            eventType: "birthday",
            colors: ["#FF5733", "#33FF57"],
            style: "playful",
            theme: "Balloon",
            imageUrl:
              "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
            dimensions: {
              width: 24,
              height: 36,
              unit: "inches",
            },
            materials: ["Plastic", "Metal"],
            weight: {
              value: 5,
              unit: "lbs",
            },
            inventory: {
              totalQuantity: 10,
              quantityAvailable: 8,
              allocations: [],
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isNameSlot: false,
        },
        {
          id: 2,
          sign: {
            id: "sign2",
            serialNumber: "SN002",
            name: "Celebration",
            eventType: "birthday",
            colors: ["#3357FF"],
            style: "modern",
            theme: "Stars",
            imageUrl:
              "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80",
            dimensions: {
              width: 18,
              height: 24,
              unit: "inches",
            },
            materials: ["Wood"],
            weight: {
              value: 3,
              unit: "lbs",
            },
            inventory: {
              totalQuantity: 15,
              quantityAvailable: 12,
              allocations: [],
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isNameSlot: false,
        },
        {
          id: 3,
          sign: null,
          isNameSlot: true,
        },
      ],
    },
    {
      id: "ORD67890",
      userId: "user2",
      customerInfo: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "5559876543",
        eventAddress: {
          street: "456 Oak Ave",
          city: "Dallas",
          state: "TX",
          zip: "75201",
        },
      },
      status: "processing",
      totalAmount: 349.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      eventForName: "Mike's Graduation",
      packageInfo: {
        id: "pkg2",
        name: "Graduation Package",
        price: 349.99,
        signCount: 4,
        setupDaysBefore: 2,
        teardownDaysAfter: 1,
        extraDayBeforePrice: 30,
        extraDayAfterPrice: 30,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      options: {
        earlyDelivery: true,
        latePickup: false,
      },
      previewSlots: [
        {
          id: 1,
          sign: {
            id: "sign3",
            serialNumber: "SN003",
            name: "Congrats Grad",
            eventType: "graduation",
            colors: ["#000000", "#FFD700"],
            style: "elegant",
            theme: "Academic",
            imageUrl:
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
            dimensions: {
              width: 36,
              height: 24,
              unit: "inches",
            },
            materials: ["Plastic", "Cardboard"],
            weight: {
              value: 4,
              unit: "lbs",
            },
            inventory: {
              totalQuantity: 8,
              quantityAvailable: 5,
              allocations: [],
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isNameSlot: false,
        },
        {
          id: 2,
          sign: null,
          isNameSlot: true,
        },
      ],
    },
    {
      id: "ORD24680",
      userId: "user3",
      customerInfo: {
        name: "Robert Johnson",
        email: "robert@example.com",
        phone: "5552468101",
        eventAddress: {
          street: "789 Pine Blvd",
          city: "Houston",
          state: "TX",
          zip: "77002",
        },
      },
      status: "deployed",
      totalAmount: 499.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      eventForName: "Tom & Lisa's Wedding",
      packageInfo: {
        id: "pkg3",
        name: "Wedding Package",
        price: 499.99,
        signCount: 5,
        setupDaysBefore: 1,
        teardownDaysAfter: 1,
        extraDayBeforePrice: 40,
        extraDayAfterPrice: 40,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      options: {
        earlyDelivery: false,
        latePickup: true,
      },
      previewSlots: [
        {
          id: 1,
          sign: {
            id: "sign4",
            serialNumber: "SN004",
            name: "Just Married",
            eventType: "wedding",
            colors: ["#FFFFFF", "#C0C0C0"],
            style: "elegant",
            theme: "Hearts",
            imageUrl:
              "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80",
            dimensions: {
              width: 48,
              height: 36,
              unit: "inches",
            },
            materials: ["Wood", "Metal"],
            weight: {
              value: 8,
              unit: "lbs",
            },
            inventory: {
              totalQuantity: 5,
              quantityAvailable: 3,
              allocations: [],
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isNameSlot: false,
        },
        {
          id: 2,
          sign: {
            id: "sign5",
            serialNumber: "SN005",
            name: "Forever & Always",
            eventType: "wedding",
            colors: ["#FFC0CB"],
            style: "romantic",
            theme: "Floral",
            imageUrl:
              "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80",
            dimensions: {
              width: 24,
              height: 36,
              unit: "inches",
            },
            materials: ["Wood"],
            weight: {
              value: 6,
              unit: "lbs",
            },
            inventory: {
              totalQuantity: 7,
              quantityAvailable: 4,
              allocations: [],
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isNameSlot: false,
        },
        {
          id: 3,
          sign: null,
          isNameSlot: true,
        },
      ],
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
