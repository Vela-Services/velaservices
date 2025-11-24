import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User, UserProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ProviderService } from "@/types/types";
import { Availability } from "@/components/AvailabilitySelector";
import { fetchServices, saveProviderServices, saveAvailability } from "@/services/provider/providerServiceService";
import { Service } from "@/types/types";

export function useProviderServices() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [providerServices, setProviderServices] = useState<ProviderService[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Fetch services
  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const servicesData = await fetchServices();
        if (isMounted) setServices(servicesData);
      } catch (err) {
        console.error("❌ Failed to fetch services from Firestore", err);
      }
    }
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch user + provider
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setProviderServices([]);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!userDoc.exists()) {
          setProfile(null);
          setProviderServices([]);
          setLoading(false);
          return;
        }

        const data = userDoc.data();
        setProfile(data as UserProfile);

        if (data.role === "provider" && Array.isArray(data.services)) {
          setProviderServices(data.services);
          setAvailability(data.availability || []);
        } else {
          setProviderServices([]);
        }
      } catch (error) {
        console.error("❌ Error loading provider services:", error);
        setProfile(null);
        setProviderServices([]);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Save availability to Firestore (debounced)
  useEffect(() => {
    if (!user) return;
    if (loading) return;
    const timeoutId = setTimeout(async () => {
      try {
        await saveAvailability(user.uid, availability);
        setSaveMsg("Availability updated!");
      } catch {
        setSaveMsg("Failed to save availability.");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [availability, user, loading]);

  const handleSaveProviderServices = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await saveProviderServices(user.uid, providerServices, availability);
      setSaveMsg("Services, prices, and availability updated successfully!");
    } catch {
      setSaveMsg("Failed to save availability.");
    } finally {
      setSaving(false);
    }
  }, [user, providerServices, availability]);

  return {
    profile,
    user,
    providerServices,
    setProviderServices,
    availability,
    setAvailability,
    services,
    loading,
    saving,
    saveMsg,
    setSaveMsg,
    handleSaveProviderServices,
  };
}

