export function formatAtLocation(atLocation: string | undefined | null): string {
  if (!atLocation) return "";
  if (atLocation === "customer") return "At Customer's Address";
  if (atLocation === "provider") return "At your place";
  return atLocation;
}

