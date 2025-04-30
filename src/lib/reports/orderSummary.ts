import { Order } from "../types";
import { formatPhoneNumber } from "../utils";

export const generateOrderSummaryContent = (order: Order): string => {
  if (!order.previewSlots || !order.eventDate) {
    throw new Error(
      "Order is missing required data for order summary generation",
    );
  }

  // Create preview section
  let previewSection = "";
  if (order.previewSlots && order.previewSlots.length > 0) {
    previewSection = `
      <div class="section">
        <div class="section-title">Sign Package Preview</div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
    `;

    order.previewSlots.forEach((slot) => {
      if (slot.isNameSlot) {
        previewSection += `
          <div style="width: 80px; height: 120px; background-color: #3b82f6; color: white; display: flex; align-items: center; justify-center; border-radius: 5px; text-align: center; padding: 5px; font-weight: bold;">
            ${order.eventForName || "Name"}
          </div>
        `;
      } else if (slot.sign) {
        previewSection += `
          <div style="width: 80px; height: 120px; background-color: white; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
            <img src="${slot.sign.imageUrl}" alt="${slot.sign.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `;
      } else {
        previewSection += `
          <div style="width: 80px; height: 120px; background-color: #f0f0f0; border: 1px dashed #ccc; border-radius: 5px; display: flex; align-items: center; justify-center; color: #999;">
            Empty
          </div>
        `;
      }
    });

    previewSection += `
        </div>
      </div>
    `;
  }

  // Create sign details section
  let signDetailsSection = `
    <div class="section">
      <div class="section-title">Sign Details</div>
      <table>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Sign</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (order.previewSlots) {
    order.previewSlots.forEach((slot) => {
      if (slot.isNameSlot) {
        signDetailsSection += `
          <tr>
            <td>${slot.id}</td>
            <td>Name Sign</td>
            <td>Custom name sign for: ${order.eventForName || "Customer"}</td>
          </tr>
        `;
      } else if (slot.sign) {
        signDetailsSection += `
          <tr>
            <td>${slot.id}</td>
            <td>${slot.sign.name}</td>
            <td>${slot.sign.eventType}, ${slot.sign.style}, ${slot.sign.color}</td>
          </tr>
        `;
      }
    });
  }

  signDetailsSection += `
      </tbody>
    </table>
  </div>
  `;

  // Create customer and event information section
  const customerSection = `
    <div class="section">
      <div class="section-title">Order Information</div>
      <table>
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <strong>Customer Information</strong><br>
            Name: ${order.customerInfo?.name || "N/A"}<br>
            Phone: ${formatPhoneNumber(order.customerInfo?.phone) || "N/A"}<br>
            Email: ${order.customerInfo?.email || "N/A"}
          </td>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <strong>Event Information</strong><br>
            Date: ${order.eventDate ? new Date(order.eventDate).toLocaleDateString() : "N/A"}<br>
            For: ${order.eventForName || "N/A"}<br>
            Address: ${order.customerInfo?.eventAddress.street || ""}, 
              ${order.customerInfo?.eventAddress.city || ""}, 
              ${order.customerInfo?.eventAddress.state || ""} 
              ${order.customerInfo?.eventAddress.zip || ""}
          </td>
        </tr>
      </table>
    </div>
  `;

  // Create package and pricing section
  const packageSection = `
    <div class="section">
      <div class="section-title">Package & Pricing</div>
      <table>
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <strong>Package Details</strong><br>
            Package: ${order.packageInfo?.name || "N/A"}<br>
            Signs: ${order.packageInfo?.signCount || 0}<br>
            Setup: ${order.packageInfo?.setupDaysBefore || 0} day(s) before<br>
            Teardown: ${order.packageInfo?.teardownDaysAfter || 0} day(s) after
          </td>
          <td style="width: 50%; vertical-align: top; padding: 10px;">
            <strong>Pricing</strong><br>
            Base Price: $${order.packageInfo?.price.toFixed(2) || "0.00"}<br>
            ${order.options?.earlyDelivery ? `Extra Day Before: $${order.packageInfo?.extraDayBeforePrice.toFixed(2) || "0.00"}<br>` : ""}
            ${order.options?.latePickup ? `Extra Day After: $${order.packageInfo?.extraDayAfterPrice.toFixed(2) || "0.00"}<br>` : ""}
            <strong>Total: $${order.totalAmount.toFixed(2)}</strong>
          </td>
        </tr>
      </table>
    </div>
  `;

  // Create schedule section
  const scheduleSection = `
    <div class="section">
      <div class="section-title">Schedule</div>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${
            order.options?.earlyDelivery && order.packageInfo && order.eventDate
              ? `
            <tr>
              <td>Early Setup</td>
              <td>${new Date(new Date(order.eventDate).setDate(new Date(order.eventDate).getDate() - (order.packageInfo.setupDaysBefore + 1))).toLocaleDateString()}</td>
              <td>Extra day before requested</td>
            </tr>
          `
              : ""
          }
          ${
            order.packageInfo && order.eventDate
              ? `
            <tr>
              <td>Standard Setup</td>
              <td>${new Date(new Date(order.eventDate).setDate(new Date(order.eventDate).getDate() - order.packageInfo.setupDaysBefore)).toLocaleDateString()}</td>
              <td>Regular setup day</td>
            </tr>
          `
              : ""
          }
          ${
            order.eventDate
              ? `
            <tr>
              <td>Event Day</td>
              <td>${new Date(order.eventDate).toLocaleDateString()}</td>
              <td>Day of the event</td>
            </tr>
          `
              : ""
          }
          ${
            order.packageInfo && order.eventDate
              ? `
            <tr>
              <td>Standard Teardown</td>
              <td>${new Date(new Date(order.eventDate).setDate(new Date(order.eventDate).getDate() + order.packageInfo.teardownDaysAfter)).toLocaleDateString()}</td>
              <td>Regular teardown day</td>
            </tr>
          `
              : ""
          }
          ${
            order.options?.latePickup && order.packageInfo && order.eventDate
              ? `
            <tr>
              <td>Late Teardown</td>
              <td>${new Date(new Date(order.eventDate).setDate(new Date(order.eventDate).getDate() + (order.packageInfo.teardownDaysAfter + 1))).toLocaleDateString()}</td>
              <td>Extra day after requested</td>
            </tr>
          `
              : ""
          }
        </tbody>
      </table>
    </div>
  `;

  // Combine all sections
  return `
    ${customerSection}
    ${previewSection}
    ${signDetailsSection}
    ${packageSection}
    ${scheduleSection}
  `;
};
