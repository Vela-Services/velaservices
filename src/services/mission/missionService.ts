import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc, DocumentData } from "firebase/firestore";

export type Mission = DocumentData & { id: string };

export async function fetchProviderMissions(providerId: string): Promise<Mission[]> {
  const missionsSnapshot = await getDocs(
    query(
      collection(db, "missions"),
      where("providerId", "==", providerId),
      where("status", "in", ["pending", "assigned"])
    )
  );
  return missionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function fetchCompletedMissions(providerId: string): Promise<Mission[]> {
  const completedSnapshot = await getDocs(
    query(
      collection(db, "missions"),
      where("providerId", "==", providerId),
      where("status", "==", "completed")
    )
  );
  return completedSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function acceptMission(missionId: string, providerId: string, mission: Mission): Promise<void> {
  const missionRef = doc(db, "missions", missionId);
  const providerRef = doc(db, "users", providerId);

  // Update mission status
  await updateDoc(missionRef, {
    status: "assigned",
    providerId: providerId,
  });

  // Update provider bookedTimes
  if (mission.times?.length) {
    const bookedSlots = {
      date: mission.date,
      times: mission.times,
    };

    await updateDoc(providerRef, {
      bookedTimes: arrayUnion(bookedSlots),
    });
  }
}

export async function getProviderData(providerId: string): Promise<Record<string, unknown> | null> {
  try {
    const providerRef = doc(db, "users", providerId);
    const providerSnap = await getDoc(providerRef);
    if (providerSnap.exists()) {
      return providerSnap.data() as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

