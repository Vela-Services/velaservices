import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { CartItem } from "../types/types";

function formatSubservices(subservices?: Record<string, number>) {
  if (!subservices || Object.keys(subservices).length === 0) return "None";
  return Object.entries(subservices)
    .map(([name, hours]) => `${name} (${hours}h)`)
    .join(", ");
}

export async function createMissionsFromCart(
  cart: CartItem[],
  customerId: string,
  displayName: string,
  address: string,
  phone: string,
  customerEmail: string,
  paymentIntentId: string,
  providerStripeAccountId: string
) {
  const missionsRef = collection(db, "missions");

  const promises = cart.map(async (item) => {
    const docRef = await addDoc(missionsRef, {
      userId: customerId,
      userName: displayName,
      userAddress: address,
      userPhone: phone,
      userEmail: customerEmail,
      serviceName: item.serviceName,
      date: item.date,
      times: item.times || [],
      price: item.price,
      createdAt: Timestamp.now(),
      status: "pending",
      providerId: item.providerId,
      providerName: item.providerName,
      stripePaymentIntentId: paymentIntentId,
      stripeAccountId: providerStripeAccountId,
      atLocation: item.atLocation ?? "",
    });

    // --- Improved Provider Email ---
    if (item.providerEmail) {
      // Calculate price minus platform fee (10%)
      const price = Number(item.price) || 0;
      const priceMinusPlatformFee = Math.round((price / 1.1) * 100) / 100; // rounded to 2 decimals
      // Calculate provider payout after 7.5% commission (on subtotal, i.e. after platform fee)
      const providerPayout = Math.round((priceMinusPlatformFee * (1 - 0.075)) * 100) / 100; // rounded to 2 decimals

      const providerEmailText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 NEW MISSION REQUEST 🌟
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${item.providerName},

You have received a new mission request with the following details:

──────────────────────────────
📝 Service:        ${item.serviceName}
📅 Date:           ${item.date}
⏰ Time(s):        ${item.times?.join(", ") || "N/A"}
💼 Subservices:    ${formatSubservices(item.subservices)}
💰 Price (customer paid):          ${item.price} NOK
💸 Price after platform fee (10%): ${priceMinusPlatformFee} NOK
💵 Your payout after 7.5% commission: ${providerPayout} NOK
🏠 Location:        ${item.atLocation ? (item.atLocation === "provider" ? "At provider's place" : "At customer's place") : "N/A"}

👤 Customer:       ${displayName}
🏠 Address:        ${address}
📞 Phone:          ${phone}
✉️ Email:          ${customerEmail}
──────────────────────────────

Please log in to your provider account to accept or decline this mission.

If you have any questions, feel free to contact the customer directly.

Thank you for being a valued provider!

Best regards,
The Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: item.providerEmail,
          subject: `New Mission Request: ${item.serviceName} for ${displayName} (${item.date})`,
          text: providerEmailText,
        }),
      });
    }

    // --- Improved Customer Email ---
    const customerEmailText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MISSION REQUEST RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello ${displayName},

Thank you for your booking! Here is a summary of your mission request:

──────────────────────────────
📝 Service:        ${item.serviceName}
📅 Date:           ${item.date}
⏰ Time(s):        ${item.times?.join(", ") || "N/A"}
💼 Subservices:    ${formatSubservices(item.subservices)}
💰 Price:          ${item.price} NOK
🏠 Location:       ${item.atLocation ? (item.atLocation === "provider" ? "At provider's place" : "At your place") : "N/A"}

👨‍🔧 Provider:      ${item.providerName}
──────────────────────────────

What happens next?
- Your provider will review your request and confirm availability.
- You will receive a confirmation email once your provider accepts the mission.
- If you need to make changes, please contact your provider directly.

If you have any questions, reply to this email or contact our support.

Thank you for choosing us!

Best regards,
The Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: customerEmail,
        subject: `Your Mission Request: ${item.serviceName} on ${item.date}`,
        text: customerEmailText,
      }),
    });

    return docRef;
  });

  await Promise.all(promises);
}
