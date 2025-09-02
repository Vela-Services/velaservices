import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Provider } from "@/types/types";

export const dayNameToIndex: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const indexToDayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getProviderAvailableDays(provider: Provider) {
  return provider.availability
    .filter((a) => a.times && a.times.length > 0)
    .map((a) => dayNameToIndex[a.day]);
}

export function getProviderAvailableTimesForDate(provider: Provider, dateStr: string) {
  if (!dateStr) return [];
  const date = new Date(dateStr + "T00:00:00");
  const dayIdx = date.getDay();
  const dayName = indexToDayName[dayIdx];
  const dayAvail = provider.availability.find((a) => a.day === dayName);
  return dayAvail && dayAvail.times ? dayAvail.times : [];
}

export function isDateTimeAtLeast24hFromNow(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return false;
  const now = new Date();
  const selected = new Date(dateStr + "T" + timeStr);
  return selected.getTime() - now.getTime() >= 24 * 60 * 60 * 1000;
}

export async function getProviderBookedSlots(providerId: string, dateStr: string): Promise<string[]> {
  const missionsRef = collection(db, "missions");
  const q = query(
    missionsRef,
    where("providerId", "==", providerId),
    where("date", "==", dateStr),
    where("status", "in", ["assigned", "pending"])
  );
  const snapshot = await getDocs(q);
  const bookedTimes: string[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (Array.isArray(data.times)) {
      bookedTimes.push(...data.times);
    } else if (typeof data.time === "string") {
      bookedTimes.push(data.time);
    }
  });
  return bookedTimes;
}

export function getConsecutiveAvailableSlots(
  availableTimes: string[],
  bookedTimes: string[] | undefined,
  requiredHours: number
): string[][] {
  let bookedSet: Set<string> = new Set();
  if (Array.isArray(bookedTimes)) {
    bookedSet = new Set(bookedTimes);
  } else if (bookedTimes && typeof bookedTimes === "object" && typeof (bookedTimes as any).forEach === "function") {
    bookedSet = new Set(Array.from(bookedTimes as any));
  }

  const available = availableTimes.filter((t) => !bookedSet.has(t));
  const result: string[][] = [];
  for (let i = 0; i <= available.length - requiredHours; i++) {
    let block = available.slice(i, i + requiredHours);
    let isConsecutive = true;
    for (let j = 1; j < block.length; j++) {
      const [h1, m1] = block[j - 1].split(":").map(Number);
      const [h2, m2] = block[j].split(":").map(Number);
      if (h2 * 60 + m2 !== h1 * 60 + m1 + 60) {
        isConsecutive = false;
        break;
      }
    }
    if (isConsecutive) result.push(block);
  }
  return result;
}