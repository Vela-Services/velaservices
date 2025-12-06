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
  role: "customer" | "provider" | "admin";
  /**
   * Optional fine-grained permissions for future use
   * (e.g. ["admin:missions", "admin:payments"]).
   */
  permissions?: string[];
  /**
   * Optional flag for bootstrap / super admins that should
   * always retain full access even if other flags change.
   */
  isSuperAdmin?: boolean;
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
  atLocation?: string;

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

/* ----------------------------- Promo Codes ----------------------------- */

export type PromoCode = {
  id: string;
  code: string; // The actual promo code (e.g., "WELCOME10")
  discountType: "percentage" | "fixed"; // Percentage or fixed amount discount
  discountValue: number; // Percentage (0-100) or fixed amount in NOK
  usedBy: string[]; // Array of userIds who have used this code
  isActive: boolean; // Whether the code is currently active
  expiresAt?: Timestamp; // Optional expiration date
  minPurchaseAmount?: number; // Optional minimum purchase amount in NOK
  maxUses?: number; // Optional maximum total uses across all users
  createdAt: Timestamp;
  description?: string; // Optional description of the promo code
};

export type AppliedPromoCode = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number; // The actual discount amount in NOK
  description?: string; // Optional description of the promo code
};
