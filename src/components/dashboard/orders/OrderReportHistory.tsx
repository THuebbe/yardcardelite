import React from "react";
import { Order, ReportHistory } from "@/lib/types";
import { reprintReport, deleteReport } from "@/lib/reports";
import { Printer, Trash2 } from "lucide-react";

interface OrderReportHistoryProps {
  order: Order;
}

export const OrderReportHistory: React.FC<OrderReportHistoryProps> = ({
  order,
}) => {
  const handleReprintReport = (report: ReportHistory) => {
    reprintReport(report, order);
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport(reportId);
    }
  };

  if (!order.reports || order.reports.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
          No reports found for this order.
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={6} className="p-0">
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Report History</h4>
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    By
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {report.reportType === "pickTicket"
                          ? "Pick Ticket"
                          : report.reportType === "orderSummary"
                            ? "Order Summary"
                            : "Pickup Checklist"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(report.generatedAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {report.generatedBy}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleReprintReport(report)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Reprint report"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default OrderReportHistory;
