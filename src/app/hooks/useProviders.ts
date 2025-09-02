import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Provider } from "@/types/types";

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const q = query(collection(db, "users"), where("role", "==", "provider"));
        const snapshot = await getDocs(q);
        const providersData: Provider[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Provider, "id">),
        }));
        setProviders(providersData);
      } catch (err) {
        console.error("Error fetching providers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  return { providers, loading };
}