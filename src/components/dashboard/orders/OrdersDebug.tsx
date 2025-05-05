import React from "react";
import { Order, User } from "@/lib/types";

interface OrdersDebugProps {
  orders: Order[];
  filteredOrders: Order[];
  customers: User[];
  searchTerm: string;
  statusFilter: string;
}

export const OrdersDebug: React.FC<OrdersDebugProps> = ({
  orders,
  filteredOrders,
  customers,
  searchTerm,
  statusFilter,
}) => {
  return (
    <div className="bg-gray-100 p-4 mb-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Raw Orders Count: {orders.length}</p>
          <p className="font-medium">
            Filtered Orders Count: {filteredOrders.length}
          </p>
          <p className="font-medium">Customers Count: {customers.length}</p>
          <p className="font-medium">Search Term: "{searchTerm}"</p>
          <p className="font-medium">Status Filter: {statusFilter}</p>
        </div>
        <div>
          <p className="font-medium">First Raw Order:</p>
          {orders.length > 0 ? (
            <pre className="text-xs bg-gray-200 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(orders[0], null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">No raw orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};
