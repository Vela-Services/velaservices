import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { CartItem } from "../types/types";

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
    });

    // ✅ Envoi email Provider
    if (item.providerEmail) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: item.providerEmail,
          subject: "New Mission Request",
          text: `Hello ${item.providerName},

You have received a new mission request:

Service: ${item.serviceName}
Date: ${item.date}
Time(s): ${item.times?.join(", ") || "N/A"}
Customer: ${displayName}
Address: ${address}
Phone: ${phone}
Email: ${customerEmail}

Please log in to your account to accept or decline this mission.

Best regards,
The Team`,
        }),
      });
    }

    // ✅ Envoi email Customer
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: customerEmail,
        subject: "Your Mission Request Has Been Received",
        text: `Hello ${displayName},

Thank you for booking:

Service: ${item.serviceName}
Date: ${item.date}
Time(s): ${item.times?.join(", ") || "N/A"}
Provider: ${item.providerName}

Your provider will confirm soon.

Best regards,
The Team`,
      }),
    });

    return docRef;
  });

  await Promise.all(promises);
}
