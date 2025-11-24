"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

type AdminUser = {
  id: string;
  role?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export default function AdminCustomersPage() {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/customers");
        if (!res.ok) {
          throw new Error("Failed to load customers.");
        }
        const json = (await res.json()) as { customers: AdminUser[] };
        if (!cancelled) setCustomers(json.customers || []);
      } catch (err) {
        console.error("[AdminCustomers] Failed to load customers", err);
        if (!cancelled) setError("Failed to load customers.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const filtered = useMemo(() => {
    let list = customers;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((c) =>
        [c.displayName, c.email, c.phone, c.address]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    return list;
  }, [customers, search]);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#7C5E3C]">
        <p>Only admins can view customers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7C5E3C]">Customers</h1>
          <p className="text-sm text-[#7C5E3C]/70 max-w-xl">
            Overview of all customers. Use this page to quickly find a
            customer, then jump to their missions when there is an issue.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#E5D3B3] rounded-lg text-sm text-[#7C5E3C] bg-white w-56"
          />
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#7C5E3C]">
          <svg
            className="animate-spin h-6 w-6 text-[#BFA181] mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Loading customers…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#7C5E3C]">
          <p className="text-lg font-semibold mb-1">No customers found</p>
          <p className="text-sm text-[#7C5E3C]/70">
            Try adjusting the search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="bg-white rounded-2xl shadow-md border border-[#F5E8D3] p-4 flex flex-col gap-3 text-sm text-[#7C5E3C]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-base font-semibold">
                    {c.displayName || c.email || "Unnamed customer"}
                  </p>
                  <p className="text-xs text-[#7C5E3C]/70">
                    {c.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label="Phone" value={c.phone || "—"} />
                <InfoRow label="Address" value={c.address || "—"} />
              </div>

              <div className="mt-2">
                <Link
                  href={`/admin/missions?search=${encodeURIComponent(
                    c.email || c.displayName || c.id
                  )}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#BFA181] text-xs font-semibold text-[#7C5E3C] hover:bg-[#F5E8D3] transition"
                >
                  View missions
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-[#7C5E3C]/60">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}


