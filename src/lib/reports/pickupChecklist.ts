import { Order } from "../types";
import { formatPhoneNumber } from "../utils";

export const generatePickupChecklistContent = (order: Order): string => {
  if (!order.previewSlots || !order.eventDate) {
    throw new Error(
      "Order is missing required data for pickup checklist generation",
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
      <div class="section-title">Pickup Checklist</div>
      <div style="margin-bottom: 20px;">
        <p><strong>Scheduled Pickup Date:</strong> ${
          order.packageInfo && order.eventDate
            ? new Date(
                new Date(order.eventDate).setDate(
                  new Date(order.eventDate).getDate() +
                    (order.packageInfo.teardownDaysAfter +
                      (order.options?.latePickup ? 1 : 0)),
                ),
              ).toLocaleDateString()
            : "N/A"
        }</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Sign Condition Checklist:</strong></p>
        <table>
          <thead>
            <tr>
              <th>Sign</th>
              <th>Condition</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Add sign slots to checklist
  signSlots.forEach((slot) => {
    if (slot.sign) {
      content += `
        <tr>
          <td>${slot.sign.name}</td>
          <td>
            □ Good<br>
            □ Damaged
          </td>
          <td style="height: 50px;"></td>
        </tr>
      `;
    }
  });

  // Add name sign if present
  if (hasNameSlot) {
    content += `
      <tr>
        <td>Custom Name Sign (${order.eventForName || "Customer"})</td>
        <td>
          □ Good<br>
          □ Damaged
        </td>
        <td style="height: 50px;"></td>
      </tr>
    `;
  }

  content += `
          </tbody>
        </table>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Pickup Verification:</strong></p>
        <div style="margin-top: 10px;">
          <p>Picked up on scheduled date: □ Yes □ No</p>
          <p>If no, actual pickup date: _____________________</p>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Additional Notes:</strong></p>
        <div style="border: 1px solid #ddd; min-height: 100px; padding: 10px;"></div>
      </div>
      
      <div style="margin-top: 30px;">
        <p><strong>Checked by:</strong> _____________________ <strong>Date:</strong> _____________________</p>
        <p><strong>Customer Signature:</strong> _____________________ <strong>Date:</strong> _____________________</p>
      </div>
    </div>
  `;

  return content;
};
