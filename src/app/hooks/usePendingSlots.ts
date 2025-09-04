import { collection, addDoc, serverTimestamp, doc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { getProviderBookedSlots } from "../../lib/availabilityUtils";


export async function addPendingSlot(
  customerId: string,
  providerId: string,
  serviceId: string,
  date: string,
  times: string[]
) {
  const ref = collection(db, "pendingSlots");
  console.log(customerId, "customer");
  return await addDoc(ref, {
    userId: customerId,
    providerId,
    serviceId,
    date,
    times,
    createdAt: serverTimestamp(),
  });
}


export async function removePendingSlot(slotId: string) {
  const ref = doc(db, "pendingSlots", slotId);
  await deleteDoc(ref);
}



export async function getProviderSlotsWithPending(
  providerId: string,
  dateStr: string
): Promise<string[]> {
  // Booked slots "confirmés"
  const bookedTimes = await getProviderBookedSlots(providerId, dateStr);

  // Slots temporaires
  const q = query(
    collection(db, "pendingSlots"),
    where("providerId", "==", providerId),
    where("date", "==", dateStr)
  );
  const snap = await getDocs(q);

  let pendingTimes: string[] = [];
  snap.forEach((doc) => {
    const data = doc.data();
    if (Array.isArray(data.times)) {
      pendingTimes = pendingTimes.concat(data.times);
    }
  });
  return [...bookedTimes, ...pendingTimes];
}


