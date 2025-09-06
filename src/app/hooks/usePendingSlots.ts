import { collection, addDoc, serverTimestamp, doc, deleteDoc, getDocs, query, where, getDoc } from "firebase/firestore";
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


export async function removePendingSlot(slotId: string, currentUserId?: string) {
  if (!slotId || typeof slotId !== "string" || slotId.trim() === "") {
    console.error("❌ Invalid slotId provided to removePendingSlot:", slotId);
    return;
  }
  try {
    const ref = doc(db, "pendingSlots", slotId);
    const slotSnap = await getDoc(ref);
    if (!slotSnap.exists()) {
      console.error("❌ Pending slot does not exist:", slotId);
      return;
    }
    const slotData = slotSnap.data();
    if (!slotData || !slotData.userId) {
      console.error("❌ Pending slot missing userId:", slotId);
      return;
    }
    if (currentUserId && slotData.userId !== currentUserId) {
      console.error("❌ Current user does not match slot userId. Not allowed to remove this slot.");
      return;
    }
    await deleteDoc(ref);
    // Optionally, you could return true to indicate success
    // return true;
  } catch (error) {
    console.error("❌ Error removing pending slot:", error);
    // Optionally, you could throw or return false
    // throw error;
  }
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


