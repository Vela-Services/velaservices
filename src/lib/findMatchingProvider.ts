import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { UserProfile } from "@/types/types";

export async function findMatchingProviders(service: string, date: string, time: string): Promise<(UserProfile & { uid: string })[]> {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  return snapshot.docs
    .map(doc => ({ ...(doc.data() as UserProfile), uid: doc.id }))
    .filter(user =>
      user.role === "provider" &&
      user.services?.includes(service) &&
      user.availability?.some(a => a.day === date && a.times.includes(time))
    );
}
