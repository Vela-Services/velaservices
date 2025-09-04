import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Service, SubService } from "@/types/types";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchServices() {
      try {
        const servicesCol = collection(db, "services");
        const servicesSnap = await getDocs(servicesCol);
        const servicesArr: Service[] = servicesSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          const subServices: SubService[] | undefined = data.subServices?.map(
            (subData: Record<string, unknown>) => ({
              id: subData.id as string,
              name: subData.name as string,
              price: subData.price as number,
              baseDuration: subData.baseDuration as number,
            })
          );
          return {
            id: docSnap.id,
            name: data.name,
            subServices: subServices?.length ? subServices : undefined,
          };
        });
        if (isMounted) setServices(servicesArr);
      } catch (err) {
        console.error("❌ Failed to fetch services from Firestore", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return { services, loading };
}