import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function dayLabel(day: string): string {
  switch (day.toLowerCase()) {
    case "mon":
    case "monday":
      return "Monday";
    case "tue":
    case "tuesday":
      return "Tuesday";
    case "wed":
    case "wednesday":
      return "Wednesday";
    case "thu":
    case "thursday":
      return "Thursday";
    case "fri":
    case "friday":
      return "Friday";
    case "sat":
    case "saturday":
      return "Saturday";
    case "sun":
    case "sunday":
      return "Sunday";
    default:
      return day;
  }
}
