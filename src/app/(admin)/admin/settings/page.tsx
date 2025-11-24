"use client";

import React from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function AdminSettingsPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#7C5E3C]">
        <p>Only admins can view settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#7C5E3C]">Settings</h1>
        <p className="text-sm text-[#7C5E3C]/70 max-w-xl">
          High-level configuration for the platform. For now this page gives
          you visibility into key values used in the codebase; later we can
          move them fully into Firestore to make them editable.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-lg font-semibold text-[#7C5E3C] mb-3">
          Fees & commissions
        </h2>
        <p className="text-sm text-[#7C5E3C]/80 mb-2">
          The following values are currently hard-coded in the payment logic:
        </p>
        <ul className="list-disc list-inside text-sm text-[#7C5E3C] space-y-1">
          <li>Platform fee: 10% (deducted from the customer price).</li>
          <li>
            Provider commission: 7.5% (applied to the subtotal after platform
            fee before payout).
          </li>
        </ul>
        <p className="mt-3 text-xs text-[#7C5E3C]/70">
          When we move these to Firestore, this page will allow you to update
          them without changing the code.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-lg font-semibold text-[#7C5E3C] mb-3">
          Service catalog
        </h2>
        <p className="text-sm text-[#7C5E3C]/80 mb-2">
          Services (cleaning, babysitting, petcare, etc.) are currently defined
          directly in the app. Over time we can move the catalog to Firestore
          and surface an editor here, so you can add or tweak services without
          deploying new code.
        </p>
      </section>
    </div>
  );
}



