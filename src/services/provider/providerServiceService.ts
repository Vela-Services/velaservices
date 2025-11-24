import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { Service, SubService, ProviderService } from "@/types/types";
import { Availability } from "@/components/AvailabilitySelector";

export async function fetchServices(): Promise<Service[]> {
  const servicesCol = collection(db, "services");
  const servicesSnap = await getDocs(servicesCol);

  const servicesArr: Service[] = [];

  for (const docSnap of servicesSnap.docs) {
    const data = docSnap.data();

    const subServices: SubService[] | undefined = data.subServices?.map(
      (subData: unknown) => {
        const s = subData as {
          id: string;
          name: string;
          price: number;
          baseDuration: number;
          description?: string;
        };
        return {
          id: s.id,
          name: s.name,
          price: s.price,
          baseDuration: s.baseDuration,
          description: s.description || undefined,
        };
      }
    );

    servicesArr.push({
      id: docSnap.id,
      name: data.name,
      subServices: subServices?.length ? subServices : undefined,
    });
  }

  return servicesArr;
}

export async function saveProviderServices(
  userId: string,
  services: ProviderService[],
  availability: Availability[]
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      services: services,
      availability: availability,
    },
    { merge: true }
  );
}

export async function saveAvailability(
  userId: string,
  availability: Availability[]
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { availability }, { merge: true });
}

