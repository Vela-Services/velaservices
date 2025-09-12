import { useState } from "react";
import { toast } from "react-hot-toast";

export const useStripeProvider = () => {
  const [loading, setLoading] = useState(false);

  const createProviderAccount = async (email: string, providerId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-provider-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, providerId }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const transferToProvider = async ({
    amount,
    stripeAccountId,
    missionId,
    description,
  }: {
    amount: number;
    stripeAccountId: string;
    missionId: string;
    description?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/transfer-to-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // Conversion en centimes
          stripeAccountId,
          missionId,
          description,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      toast.success(`Transfert de ${data.amount / 100} NOK effectué !`);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur de transfert";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createProviderAccount, transferToProvider, loading };
};