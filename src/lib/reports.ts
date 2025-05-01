import { Order, OrderReport } from "./types";
// Import the report generation functions
import { generateOrderSummaryContent } from "./reports/orderSummary";
import { generatePickTicketContent } from "./reports/pickTicket";
import { generatePickupChecklistContent } from "./reports/pickupChecklist";
import { formatPhoneNumber } from "./utils";
import { createClient } from "@/utils/supabase/client";

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

// Local cache for pickup info (this would also be moved to Supabase in a full implementation)
const pickupInfoData: Record<string, PickupInfo> = {};

// These variables are no longer used as we're using Supabase now
// Kept as empty objects for backward compatibility
const reportHistoryData: Record<string, any[]> = {};
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
            <p>YardCard Elite Configurator - Generated on ${new Date().toLocaleString()}</p>
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

// Get report file from Supabase storage
export const getReportFile = async (
  filename: string,
): Promise<string | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reports")
      .select("report_data")
      .eq("filename", filename)
      .single();

    if (error) {
      console.error("Error retrieving report file:", error);
      return null;
    }

    return data?.report_data || null;
  } catch (error) {
    console.error("Error retrieving report file:", error);
    return null;
  }
};

// Save report to history in Supabase
const saveReportToHistory = async (
  orderId: string,
  reportType: "pickTicket" | "orderSummary" | "pickupChecklist",
  content: string,
  filename: string,
  htmlContent: string,
) => {
  try {
    const supabase = createClient();
    const user = (await supabase.auth.getUser()).data.user;
    const userId = user?.id || "system";

    // Create a report history entry
    const reportData = {
      order_id: orderId,
      report_type: reportType,
      generated_at: new Date().toISOString(),
      generated_by: userId,
      filename: filename,
      report_data: htmlContent, // Store the full HTML content
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from("reports")
      .insert(reportData)
      .select();

    if (error) {
      console.error("Error saving report to history:", error);
    } else {
      console.log("Report saved successfully:", data);
    }
  } catch (error) {
    console.error("Error saving report to history:", error);
  }
};

// Get reports for an order from Supabase
export const getOrderReports = async (
  orderId: string,
): Promise<ReportHistory[]> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("order_id", orderId)
      .order("generated_at", { ascending: false });

    if (error) {
      console.error("Error fetching order reports:", error);
      return [];
    }

    // Transform the data to match the ReportHistory interface
    return data.map((report) => ({
      id: report.id,
      orderId: report.order_id,
      reportType: report.report_type as
        | "pickTicket"
        | "orderSummary"
        | "pickupChecklist",
      generatedAt: report.generated_at,
      generatedBy: report.generated_by,
      createdAt: report.created_at,
      filename: report.filename,
      reportData: report.report_data,
    }));
  } catch (error) {
    console.error("Error fetching order reports:", error);
    return [];
  }
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
export const reprintReport = async (
  report: ReportHistory,
  order: Order,
): Promise<void> => {
  console.log(`Reprinting report ${report.id} for order ${order.id}`);

  const title =
    report.reportType === "pickTicket"
      ? "Pick Ticket"
      : report.reportType === "orderSummary"
        ? "Order Summary"
        : "Pickup Checklist";

  try {
    // Try to get the saved report file from Supabase
    const reportContent = await getReportFile(report.filename);

    if (reportContent) {
      // If we have the saved file, open it in a new window
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(reportContent);
        printWindow.document.close();
      }
    } else if (report.reportData) {
      // If the file is not found but we have report data in the report object, recreate it
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
                <p><strong>REPRINT</strong> - Originally generated on ${new Date(report.generatedAt).toLocaleString()}</p>
              </div>
              ${report.reportData}
              <div class="footer">
                <p>YardCard Elite Configurator - Reprinted on ${new Date().toLocaleString()}</p>
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
  } catch (error) {
    console.error("Error reprinting report:", error);
    alert(
      `Error reprinting report: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Delete a report
export const deleteReport = async (reportId: string): Promise<void> => {
  console.log(`Deleting report ${reportId}`);
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error("Error deleting report:", error);
      throw new Error(`Failed to delete report: ${error.message}`);
    }

    console.log(`Report ${reportId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting report:", error);
    alert(
      `Error deleting report: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Save pickup information
export const savePickupInfo = async (
  orderId: string,
  pickupInfo: PickupInfo,
): Promise<void> => {
  console.log(`Saving pickup info for order ${orderId}`, pickupInfo);
  try {
    // Store in local cache for now
    pickupInfoData[orderId] = pickupInfo;

    // In a full implementation, this would save to Supabase
    // Example of how it would be implemented:
    /*
    const supabase = createClient();
    const { error } = await supabase
      .from("pickup_info")
      .upsert({
        order_id: orderId,
        pickup_date: pickupInfo.pickupDate,
        sign_conditions: pickupInfo.signConditions,
        notes: pickupInfo.notes,
        picked_up_on_time: pickupInfo.pickedUpOnTime,
        late_fee: pickupInfo.lateFee,
        checked_by: pickupInfo.checkedBy,
      });

    if (error) {
      console.error("Error saving pickup info:", error);
      throw new Error(`Failed to save pickup info: ${error.message}`);
    }
    */

    alert(`Check-in completed for order ${orderId}`);
  } catch (error) {
    console.error("Error saving pickup info:", error);
    alert(
      `Error saving pickup info: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Export the report generation functions directly
export {
  generateOrderSummaryContent,
  generatePickTicketContent,
  generatePickupChecklistContent,
};
