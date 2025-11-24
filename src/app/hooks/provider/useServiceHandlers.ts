import { useState } from "react";
import { Service, ProviderService } from "@/types/types";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export function useServiceHandlers(
  user: { uid: string } | null,
  services: Service[],
  providerServices: ProviderService[],
  setProviderServices: React.Dispatch<React.SetStateAction<ProviderService[]>>,
  setSaveMsg: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [saving, setSaving] = useState(false);

  const handleProviderServiceToggle = async (serviceId: string) => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);

    let updatedServices: ProviderService[];
    const exists = providerServices.some((s) => s.serviceId === serviceId);

    if (exists) {
      updatedServices = providerServices.filter(
        (s) => s.serviceId !== serviceId
      );
    } else {
      const service = services.find((s) => s.id === serviceId);
      updatedServices = [
        ...providerServices,
        {
          serviceId: service!.id,
          subServices: service?.subServices || [],
        },
      ];
    }

    setProviderServices(updatedServices);

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { services: updatedServices }, { merge: true });
      setSaveMsg("Services updated!");
    } catch {
      setSaveMsg("Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubServiceToggle = (serviceId: string, subServiceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    const subService = service?.subServices?.find((s) => s.id === subServiceId);
    if (!subService) return;

    setProviderServices((prev) =>
      prev.map((ps) => {
        if (ps.serviceId !== serviceId) return ps;
        const exists = ps.subServices?.some((s) => s.id === subServiceId);
        return {
          ...ps,
          subServices: exists
            ? ps.subServices!.filter((s) => s.id !== subServiceId)
            : [...(ps.subServices || []), subService],
        };
      })
    );
  };

  const handleSubServicePriceChange = (
    serviceId: string,
    subId: string,
    price: number
  ) => {
    setProviderServices((prev) =>
      prev.map((ps) => {
        if (ps.serviceId !== serviceId) return ps;
        return {
          ...ps,
          subServices: ps.subServices!.map((s) =>
            s.id === subId ? { ...s, price } : s
          ),
        };
      })
    );
  };

  return {
    saving,
    handleProviderServiceToggle,
    handleSubServiceToggle,
    handleSubServicePriceChange,
  };
}

