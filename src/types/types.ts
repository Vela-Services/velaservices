export type UserProfile = {
    role: "customer" | "provider";
    why?: string;
    createdAt?: number; // ou `Date` si tu castes les timestamps Firestore
    displayName?: string;
    phone?: string;
    address?: string;
  };
  