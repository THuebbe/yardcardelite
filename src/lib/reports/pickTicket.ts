import { Order } from "../types";
import { formatPhoneNumber } from "../utils";

export const generatePickTicketContent = (order: Order): string => {
  if (!order.previewSlots || !order.eventDate) {
    throw new Error(
      "Order is missing required data for pick ticket generation",
    );
  }

  const signSlots =
    order.previewSlots.filter((slot) => slot.sign && !slot.isNameSlot) || [];
  const hasNameSlot =
    order.previewSlots.some((slot) => slot.isNameSlot) || false;

  let content = `
    <div class="section">
      <div class="section-title">Customer Information</div>
      <p><strong>Name:</strong> ${order.customerInfo?.name || "N/A"}</p>
      <p><strong>Phone:</strong> ${formatPhoneNumber(order.customerInfo?.phone) || "N/A"}</p>
      <p><strong>Email:</strong> ${order.customerInfo?.email || "N/A"}</p>
    </div>
    
    <div class="section">
      <div class="section-title">Event Details</div>
      <p><strong>Event Date:</strong> ${order.eventDate ? new Date(order.eventDate).toLocaleDateString() : "N/A"}</p>
      <p><strong>Event For:</strong> ${order.eventForName || "N/A"}</p>
      <p><strong>Address:</strong> ${order.customerInfo?.eventAddress.street || ""}, 
        ${order.customerInfo?.eventAddress.city || ""}, 
        ${order.customerInfo?.eventAddress.state || ""} 
        ${order.customerInfo?.eventAddress.zip || ""}
      </p>
    </div>
    
    <div class="section">
      <div class="section-title">Signs to Pull</div>
      <table>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Sign Name</th>
            <th>Type</th>
            <th>Style</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add sign slots
  signSlots.forEach((slot) => {
    if (slot.sign) {
      content += `
        <tr>
          <td>${slot.id}</td>
          <td>${slot.sign.name}</td>
          <td>${slot.sign.eventType}</td>
          <td>${slot.sign.style}</td>
          <td style="background-color: ${slot.sign.color}; color: ${slot.sign.color === "#000000" ? "white" : "black"}">${slot.sign.color}</td>
        </tr>
      `;
    }
  });

  // Add name slot if present
  if (hasNameSlot) {
    content += `
      <tr>
        <td colspan="5">
          <strong>Name Sign Required:</strong> Create custom name sign for "${order.eventForName || "Customer"}"
        </td>
      </tr>
    `;
  }

  content += `
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <div class="section-title">Package Information</div>
    <p><strong>Package:</strong> ${order.packageInfo?.name || "N/A"}</p>
    <p><strong>Setup:</strong> ${order.packageInfo?.setupDaysBefore || 0} day(s) before event (${
      order.eventDate
        ? new Date(
            new Date(order.eventDate).setDate(
              new Date(order.eventDate).getDate() -
                (order.packageInfo?.setupDaysBefore || 0),
            ),
          ).toLocaleDateString()
        : "N/A"
    })</p>
    <p><strong>Teardown:</strong> ${order.packageInfo?.teardownDaysAfter || 0} day(s) after event (${
      order.eventDate
        ? new Date(
            new Date(order.eventDate).setDate(
              new Date(order.eventDate).getDate() +
                (order.packageInfo?.teardownDaysAfter || 0),
            ),
          ).toLocaleDateString()
        : "N/A"
    })</p>
    ${order.options?.earlyDelivery ? "<p><strong>Extra Day Before:</strong> Yes</p>" : ""}
    ${order.options?.latePickup ? "<p><strong>Extra Day After:</strong> Yes</p>" : ""}
  </div>
  `;

  // Add portrait orientation styling
  return `
    <style>
      @page {
        size: portrait;
      }
      @media print {
        body {
          width: 100%;
          margin: 0;
          padding: 0;
        }
      }
    </style>
    ${content}
  `;
};
