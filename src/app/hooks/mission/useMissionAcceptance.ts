import { useState } from "react";
import { acceptMission, getProviderData, Mission } from "@/services/mission/missionService";
import {
  generateCustomerAcceptanceEmail,
  generateProviderAcceptanceEmail,
  sendEmail,
  MissionEmailData,
} from "@/services/mission/missionEmailService";

export function useMissionAcceptance(userId: string | null) {
  const [accepting, setAccepting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAcceptMission = async (mission: Mission) => {
    if (!userId) {
      setError("User ID is null");
      return { success: false, error: "User ID is null" };
    }

    setAccepting(mission.id);
    setError(null);
    setSuccess(null);

    try {
      // Accept mission in database
      await acceptMission(mission.id, userId, mission);

      // Fetch provider data
      const providerData = await getProviderData(userId);

      // Prepare email data
      const customerEmail = mission.customerEmail || mission.userEmail;
      const providerEmail = providerData?.email || mission.providerEmail;
      const providerName = providerData?.displayName || mission.providerName || "Your Provider";
      const customerName = mission.userName || "Customer";
      const serviceName = mission.serviceName || "Service";
      const date = mission.date || "";
      const times = Array.isArray(mission.times)
        ? mission.times.join(", ")
        : mission.time || mission.times || "";
      const address = mission.userAddress || "";
      const phone = mission.userPhone || "";
      const notes = mission.notes || "";
      const subservices = mission.subservices;
      const price = typeof mission.price === "number"
        ? mission.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : mission.price || "";
      const atLocation = mission.atLocation || "";

      const emailData: MissionEmailData = {
        customerEmail,
        customerName,
        providerEmail,
        providerName,
        serviceName,
        date,
        times,
        address,
        phone,
        notes,
        subservices,
        price,
        atLocation,
      };

      // Send emails
      if (customerEmail) {
        const customerEmailContent = generateCustomerAcceptanceEmail(emailData);
        await sendEmail(customerEmail, customerEmailContent.subject, customerEmailContent.text);
      }

      if (providerEmail) {
        const providerEmailContent = generateProviderAcceptanceEmail(emailData);
        await sendEmail(providerEmail, providerEmailContent.subject, providerEmailContent.text);
      }

      setSuccess("Mission accepted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Failed to accept mission.", error);
      setError("Failed to accept mission.");
      return { success: false, error };
    } finally {
      setAccepting(null);
    }
  };

  return {
    accepting,
    error,
    success,
    handleAcceptMission,
  };
}

