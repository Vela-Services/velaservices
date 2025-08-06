import { Timestamp } from "firebase/firestore";

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

export type CartItem = {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
};

export type Missions = {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  price: number;
  date: string;
  time: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
