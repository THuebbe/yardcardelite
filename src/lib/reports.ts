import { Order, OrderReport } from "./types";
// Import the report generation functions
import { generateOrderSummaryContent } from "./reports/orderSummary";
import { generatePickTicketContent } from "./reports/pickTicket";
import { generatePickupChecklistContent } from "./reports/pickupChecklist";
import { formatPhoneNumber } from "./utils";

// Type definitions for the new types used in the components
export interface ReportHistory extends OrderReport {
  createdAt: string;
  filename: string;
  reportData?: string;
}

export interface SignCondition {
  signId: string;
  condition: "good" | "damaged";
}

export interface PickupInfo {
  pickupDate: string;
  signConditions: SignCondition[];
  notes: string;
  pickedUpOnTime: boolean;
  lateFee?: number;
  checkedBy: string;
}

// Mock data and placeholder functions for now
const reportHistoryData: Record<string, ReportHistory[]> = {};
const pickupInfoData: Record<string, PickupInfo> = {};
const reportsDirectory: Record<string, string> = {};

// Helper function to create a PDF document
const createPDF = (
  content: string,
  title: string,
  order: Order,
  reportType: "pickTicket" | "orderSummary" | "pickupChecklist",
): void => {
  // Generate a unique filename for the report
  const reportId = Math.random().toString(36).substring(2, 10);
  const filename = `${reportType}_${order.id.substring(0, 8)}_${reportId}.html`;

  // In a real application, this would use a PDF library
  // For this demo, we'll simulate PDF creation by opening a new window with the content
  const printWindow = window.open("", "_blank");

  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ccc;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .sign-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
            }
            .sign-image {
              width: 50px;
              height: 50px;
              object-fit: cover;
              margin-right: 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .checklist-item {
              margin-bottom: 10px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .condition-box {
              display: inline-block;
              width: 15px;
              height: 15px;
              border: 1px solid #000;
              margin-right: 5px;
            }
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Order #${order.id.substring(0, 8)} - ${new Date().toLocaleString()}</p>
          </div>
          ${content}
          <div class="footer">
            <p>Sign Hero Configurator - Generated on ${new Date().toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print();" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Document
            </button>
          </div>
          <script>
            // Auto-print after a short delay to ensure content is loaded
            setTimeout(() => {
              window.print();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Save report to history with filename
    saveReportToHistory(
      order.id,
      reportType,
      content,
      filename,
      printWindow.document.documentElement.outerHTML,
    );
  }
};

// Save report file to storage
const saveReportFile = (filename: string, htmlContent: string) => {
  try {
    // In a real app, this would save to a database or file storage
    reportsDirectory[filename] = htmlContent;
  } catch (error) {
    console.error("Error saving report file:", error);
  }
};

// Get report file from storage
export const getReportFile = (filename: string): string | null => {
  try {
    return reportsDirectory[filename] || null;
  } catch (error) {
    console.error("Error retrieving report file:", error);
    return null;
  }
};

// Save report to history
const saveReportToHistory = (
  orderId: string,
  reportType: "pickTicket" | "orderSummary" | "pickupChecklist",
  content: string,
  filename: string,
  htmlContent: string,
) => {
  // Create a report history entry
  const reportId = `report-${Date.now()}`;

  const reportHistory: ReportHistory = {
    id: reportId,
    orderId: orderId,
    reportType: reportType,
    generatedAt: new Date().toISOString(),
    generatedBy: "current-user", // In a real app, this would be the current user's ID
    createdAt: new Date().toISOString(),
    filename: filename,
    reportData: content,
  };

  // Save to mock data
  if (!reportHistoryData[orderId]) {
    reportHistoryData[orderId] = [];
  }
  reportHistoryData[orderId].push(reportHistory);

  // Save the HTML content
  saveReportFile(filename, htmlContent);
};

// Get reports for an order
export const getOrderReports = (orderId: string): ReportHistory[] => {
  return reportHistoryData[orderId] || [];
};

// Generate a new report
export const generateReport = (
  order: Order,
  reportType: "orderSummary" | "pickTicket" | "pickupChecklist",
): string => {
  switch (reportType) {
    case "orderSummary":
      return generateOrderSummaryContent(order);
    case "pickTicket":
      return generatePickTicketContent(order);
    case "pickupChecklist":
      return generatePickupChecklistContent(order);
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
};

// Create a new report and save it to history
export const createReport = (
  order: Order,
  reportType: "orderSummary" | "pickTicket" | "pickupChecklist",
): void => {
  // Generate the report content
  const content = generateReport(order, reportType);

  // Create the PDF with the content
  const title =
    reportType === "pickTicket"
      ? "Pick Ticket"
      : reportType === "orderSummary"
        ? "Order Summary"
        : "Pickup Checklist";

  createPDF(content, title, order, reportType);
};

// Generate specific report types
export const generateOrderSummary = (order: Order): void => {
  createReport(order, "orderSummary");
};

export const generatePickTicket = (order: Order): void => {
  createReport(order, "pickTicket");
};

export const generatePickupChecklist = (order: Order): void => {
  createReport(order, "pickupChecklist");
};

// Reprint a report from history
export const reprintReport = (report: ReportHistory, order: Order): void => {
  console.log(`Reprinting report ${report.id} for order ${order.id}`);

  const title =
    report.reportType === "pickTicket"
      ? "Pick Ticket"
      : report.reportType === "orderSummary"
        ? "Order Summary"
        : "Pickup Checklist";

  // Try to get the saved report file
  const savedReport = getReportFile(report.filename);

  if (savedReport) {
    // If we have the saved file, open it in a new window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(savedReport);
      printWindow.document.close();
    }
  } else if (report.reportData) {
    // If the file is not found but we have report data, recreate it
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title} (Reprint)</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
              }
              .section {
                margin-bottom: 20px;
              }
              .section-title {
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 16px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .sign-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
              }
              .sign-image {
                width: 50px;
                height: 50px;
                object-fit: cover;
                margin-right: 10px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
              .reprint-banner {
                background-color: #ffebee;
                color: #c62828;
                text-align: center;
                padding: 5px;
                margin-bottom: 15px;
                border: 1px solid #ef9a9a;
                border-radius: 4px;
              }
              .checklist-item {
                margin-bottom: 10px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              .condition-box {
                display: inline-block;
                width: 15px;
                height: 15px;
                border: 1px solid #000;
                margin-right: 5px;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 15px;
                }
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title} (Reprint)</h1>
              <p>Order #${order.id.substring(0, 8)}</p>
            </div>
            <div class="reprint-banner">
              <p><strong>REPRINT</strong> - Originally generated on ${new Date(report.createdAt).toLocaleString()}</p>
            </div>
            ${report.reportData}
            <div class="footer">
              <p>Sign Hero Configurator - Reprinted on ${new Date().toLocaleString()}</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <button onclick="window.print();" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Print Document
              </button>
            </div>
            <script>
              // Auto-print after a short delay to ensure content is loaded
              setTimeout(() => {
                window.print();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  } else {
    // If we don't have the report data, generate a new one
    alert(
      `Report data not found. Generating a new ${report.reportType} for order ${order.id}`,
    );
    createReport(order, report.reportType);
  }
};

// Delete a report
export const deleteReport = (reportId: string): void => {
  console.log(`Deleting report ${reportId}`);
  // In a real implementation, this would delete the report from the database
  Object.keys(reportHistoryData).forEach((orderId) => {
    const reportToDelete = reportHistoryData[orderId].find(
      (report) => report.id === reportId,
    );
    if (reportToDelete && reportToDelete.filename) {
      // Delete the report file
      delete reportsDirectory[reportToDelete.filename];
    }

    reportHistoryData[orderId] = reportHistoryData[orderId].filter(
      (report) => report.id !== reportId,
    );
  });
};

// Save pickup information
export const savePickupInfo = (
  orderId: string,
  pickupInfo: PickupInfo,
): void => {
  console.log(`Saving pickup info for order ${orderId}`, pickupInfo);
  // In a real implementation, this would save the pickup info to the database
  pickupInfoData[orderId] = pickupInfo;
  alert(`Check-in completed for order ${orderId}`);
};

// Export the report generation functions directly
export {
  generateOrderSummaryContent,
  generatePickTicketContent,
  generatePickupChecklistContent,
};
