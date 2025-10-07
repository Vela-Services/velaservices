import { Timestamp } from "firebase/firestore";

/* ----------------------------- Services ----------------------------- */

// export type ServiceOption = {
//   id: string;            // identifiant unique (ex: "oven_cleaning")
//   name: string;          // nom affiché (ex: "Oven Cleaning")
//   price?: number;        // prix optionnel
//   baseDuration?: number; // durée en heures optionnelle
// };

export type SubService = {
  id: string; // identifiant unique (ex: "simple_cleaning")
  name: string; // nom affiché (ex: "Simple Cleaning")
  price?: number; // certains subServices ont un prix direct
  baseDuration?: number; // certains ont aussi une durée de base
  description?: string; // description optionnelle
};

export type Service = {
  id: string; // identifiant unique (ex: "cleaning")
  name: string; // nom affiché (ex: "Cleaning")
  type?: string; // ex: "cleaning" (utile si tu veux catégoriser)
  subServices?: SubService[];
  description?: string; // description optionnelle
};

/* ----------------------------- Users / Providers ----------------------------- */

export type Availability = {
  day: string;
  times: string[];
};

export type ProviderService = {
  serviceId: string;
  subServices?: SubService[];
};

export type UserProfile = {
  role: "customer" | "provider";
  why?: string;
  createdAt?: number;
  displayName?: string;
  phone?: string;
  address?: string;
  services: string[];
  availability: Availability[];
  bookedSlots?: Record<string, string[]>; // Format: { "YYYY-MM-DD": ["HH:MM", "HH:MM"] }
  email?: string;
  photoURL?: string;
  stripeAccountId? : string;
  stripeOnboardingStatus?: "pending" | "active" | "incomplete";
  stripeChargesEnabled? : boolean
};

export type Provider = {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  services: ProviderService[]; // <-- mise à jour ici
  availability: Availability[];
  address?: string;
  why?: string;
  photoURL?: string;
};

/* ----------------------------- Cart & Missions ----------------------------- */

export type CartItem = {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  times: string[];
  price: number;
  providerId: string;
  providerName: string;
  providerEmail?: string;
  subservices?: Record<string, number>; // subservices avec leur quantité

};

export type Missions = {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  price: number;
  date: string;
  times: string[];
  status: "pending" | "accepted" | "completed" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
