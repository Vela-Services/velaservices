export function formatSubservices(subservices?: Record<string, number>): string {
  if (!subservices || Object.keys(subservices).length === 0) return "None";
  return Object.entries(subservices)
    .map(([name, hours]) => `${name} (${hours}h)`)
    .join(", ");
}

