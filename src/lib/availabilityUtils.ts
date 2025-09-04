import { doc, getDoc } from "firebase/firestore";
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

export function getProviderAvailableTimesForDate(
  provider: Provider,
  dateStr: string
) {
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

export async function getProviderBookedSlots(
  providerId: string,
  dateStr: string
): Promise<string[]> {
  const providerDocRef = doc(db, "users", providerId);
  const docSnap = await getDoc(providerDocRef);

  const bookedTimes: string[] = [];

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Structure attendue: bookedTimes: [{ date: string, times: string[] }, ...]
    if (Array.isArray(data.bookedTimes)) {
      for (const slot of data.bookedTimes) {
        if (slot.date === dateStr && Array.isArray(slot.times)) {
          bookedTimes.push(...slot.times);
        }
      }
    }
  }

  return bookedTimes;
}

export function getConsecutiveAvailableSlots(
  availableTimes: string[],
  bookedTimes: string[] | undefined,
  requiredHours: number
): string[][] {
  // Convert hours into 30-minute slots
  const requiredSlots = requiredHours * 2;

  // Handle edge cases
  if (
    requiredSlots <= 0 ||
    !availableTimes ||
    availableTimes.length < requiredSlots
  ) {
    return [];
  }

  // Ensure bookedTimes is an array
  const bookedSet: Set<string> = new Set(
    Array.isArray(bookedTimes) ? bookedTimes : []
  );

  // Filter out booked times and sort available times
  const available = [...availableTimes]
    .filter((t) => !bookedSet.has(t))
    .sort((a, b) => {
      const [h1, m1] = a.split(":").map(Number);
      const [h2, m2] = b.split(":").map(Number);
      return h1 * 60 + m1 - (h2 * 60 + m2);
    });

  const result: string[][] = [];

  // Find consecutive blocks of requiredSlots (30 min each)
  for (let i = 0; i <= available.length - requiredSlots; i++) {
    const block = available.slice(i, i + requiredSlots);
    let isConsecutive = true;

    // Check if the block is consecutive (each slot is 30 minutes apart)
    for (let j = 1; j < block.length; j++) {
      const [h1, m1] = block[j - 1].split(":").map(Number);
      const [h2, m2] = block[j].split(":").map(Number);
      const time1 = h1 * 60 + m1;
      const time2 = h2 * 60 + m2;

      if (time2 !== time1 + 30) {
        isConsecutive = false;
        console.log(
          `Block ${block} is not consecutive at index ${j}: ${
            block[j - 1]
          } to ${block[j]}`
        );
        break;
      }
    }

    if (isConsecutive) {
      result.push(block);
    }
  }
  return result;
}
