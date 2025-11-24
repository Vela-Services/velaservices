import { formatSubservices } from "@/utils/mission/formatSubservices";
import { formatAtLocation } from "@/utils/mission/formatAtLocation";

export type MissionEmailData = {
  customerEmail?: string;
  customerName: string;
  providerEmail?: string;
  providerName: string;
  serviceName: string;
  date: string;
  times: string | string[];
  address: string;
  phone: string;
  notes?: string;
  subservices?: Record<string, number>;
  price: string | number;
  atLocation?: string;
};

export function generateCustomerAcceptanceEmail(data: MissionEmailData): { subject: string; text: string } {
  const times = Array.isArray(data.times) ? data.times.join(", ") : data.times || "N/A";
  const price = typeof data.price === "number"
    ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : data.price || "";

  const text = `
Hi ${data.customerName},

Good news! Your provider (${data.providerName}) has accepted your mission request.

📝 Service:        ${data.serviceName}
📅 Date:           ${data.date}
⏰ Time(s):        ${times}
💼 Subservices:    ${formatSubservices(data.subservices)}
${data.atLocation ? `📍 Location:       ${formatAtLocation(data.atLocation)}` : ""}
💰 Price:          ${price ? price + " NOK" : "N/A"}

👨‍🔧 Provider:      ${data.providerName}
──────────────────────────────

What happens next?
- Your provider will be in touch if there are any questions.
- If you need to make changes, please contact your provider directly.

If you have any questions, reply to this email or contact our support.

Thank you for choosing us!

Best regards,
The Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  return {
    subject: `Your Mission is Confirmed: ${data.serviceName} on ${data.date}`,
    text,
  };
}

export function generateProviderAcceptanceEmail(data: MissionEmailData): { subject: string; text: string } {
  const times = Array.isArray(data.times) ? data.times.join(", ") : data.times || "N/A";
  const price = typeof data.price === "number"
    ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : data.price || "";

  const text = `
Hi ${data.providerName},

You have accepted a new mission!

📝 Service:        ${data.serviceName}
📅 Date:           ${data.date}
⏰ Time(s):        ${times}
💼 Subservices:    ${formatSubservices(data.subservices)}
${data.atLocation ? `📍 Location:       ${formatAtLocation(data.atLocation)}` : ""}
💰 Price:          ${price ? price + " NOK" : "N/A"}

👤 Customer:       ${data.customerName}
📍 Address:        ${data.address}
📞 Phone:          ${data.phone}
✉️ Email:          ${data.customerEmail || "N/A"}
${data.notes ? `📝 Notes:          ${data.notes}` : ""}

Please make sure to contact the customer if needed and prepare for the mission.

Best regards,
The Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  return {
    subject: `Mission Accepted: ${data.serviceName} for ${data.customerName} on ${data.date}`,
    text,
  };
}

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, text }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }
}

