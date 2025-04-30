import React from "react";
import { Printer, Trash2 } from "lucide-react";
import { Order } from "@/lib/types";
import {
  ReportHistory,
  getOrderReports,
  reprintReport,
  deleteReport,
} from "@/lib/reports";

interface OrderReportHistoryProps {
  order: Order;
}

export const OrderReportHistory: React.FC<OrderReportHistoryProps> = ({
  order,
}) => {
  const orderReports = getOrderReports(order.id);

  const handleReprintReport = (report: ReportHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    reprintReport(report, order);
  };

  const handleDeleteReport = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone.",
      )
    ) {
      deleteReport(reportId);
      // Force a reload to reflect the changes
      window.location.reload();
    }
  };

  return (
    <tr onClick={(e) => e.stopPropagation()}>
      <td colSpan={6} className="p-0 bg-gray-50 border-b border-gray-200">
        <div className="p-4">
          <h4 className="font-medium text-gray-700 mb-2">Report History</h4>
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Generated On
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Filename
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No reports found for this order.
                    </td>
                  </tr>
                ) : (
                  orderReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">
                        {report.reportType === "pickTicket"
                          ? "Pick Ticket"
                          : "Order Summary"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(report.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm">{report.filename}</td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleReprintReport(report, e)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reprint Report"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteReport(report.id, e)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};
