export type UserProfile = {
  role: "customer" | "provider";
  why?: string;
  createdAt?: number; // ou `Date` si tu castes les timestamps Firestore
  displayName?: string;
  phone?: string;
  address?: string;
  services: string[]; // ex: ["cleaning", "babysitting"]
  availability: {
    day: string; // ex: "2025-07-15"
    times: string[]; // ex: ["10:00", "14:00"]
  }[];
};
