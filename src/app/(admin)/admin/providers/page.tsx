"use client";

import React, { useEffect, useMemo, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/app/hooks/useAuth";

type AdminUser = {
  id: string;
  role?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  address?: string;
  services?: unknown;
  availability?: unknown;
  stripeAccountId?: string;
  stripeOnboardingStatus?: "pending" | "active" | "incomplete";
  stripeChargesEnabled?: boolean;
  isActive?: boolean;
};

export default function AdminProvidersPage() {
  const { isAdmin, user } = useAuth();
  const [providers, setProviders] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [onlyInactive, setOnlyInactive] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/providers");
        if (!res.ok) {
          throw new Error("Failed to load providers.");
        }
        const json = (await res.json()) as { providers: AdminUser[] };
        if (!cancelled) setProviders(json.providers || []);
      } catch (err) {
        console.error("[AdminProviders] Failed to load providers", err);
        if (!cancelled) setError("Failed to load providers.");
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
    let list = providers;
    if (onlyInactive) {
      list = list.filter((p) => p.isActive === false);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((p) =>
        [
          p.displayName,
          p.email,
          p.phone,
          p.address,
          p.role,
          JSON.stringify(p.services ?? ""),
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    return list;
  }, [providers, search, onlyInactive]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin || !user?.uid) return;
    
    setUpdatingRole(userId);
    setError(null);
    
    try {
      const res = await fetch("/api/admin/users/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRole,
          requesterId: user.uid,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      // Update local state
      setProviders((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
      );
    } catch (err) {
      console.error("[AdminProviders] Failed to update role", err);
      setError(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setUpdatingRole(null);
    }
  };

  // Try to turn the `services` field (which might be strings or objects)
  // into a nice comma-separated list of labels.
  function formatServices(services: unknown): string {
    if (!services) return "—";
    if (Array.isArray(services)) {
      const labels = services
        .map((s) => {
          if (!s) return null;
          if (typeof s === "string") return s;
          if (typeof s === "object") {
            const obj = s as { name?: string; id?: string; serviceId?: string };
            return obj.name || obj.id || obj.serviceId || null;
          }
          return null;
        })
        .filter((v): v is string => !!v);
      return labels.length ? labels.join(", ") : "—";
    }
    if (typeof services === "string") return services;
    return "—";
  }

  function formatStripe(provider: AdminUser): string {
    if (!provider.stripeAccountId) return "Not connected";
    const status = provider.stripeOnboardingStatus || "pending";
    const charges = provider.stripeChargesEnabled ? "charges enabled" : "charges disabled";
    const shortId =
      provider.stripeAccountId.length > 10
        ? `${provider.stripeAccountId.slice(0, 6)}…${provider.stripeAccountId.slice(-4)}`
        : provider.stripeAccountId;
    return `${shortId} – ${status}, ${charges}`;
  }

  const toggleActive = async (provider: AdminUser) => {
    if (!isAdmin) return;
    const next = provider.isActive === false ? true : false;
    const message = next
      ? `Re-activate provider "${provider.displayName || provider.email}"?`
      : `Deactivate provider "${provider.displayName || provider.email}"?\nThey will no longer appear in search or receive new missions.`;
    if (!window.confirm(message)) return;

    setUpdatingId(provider.id);
    setError(null);
    try {
      const ref = doc(db, "users", provider.id);
      await updateDoc(ref, { isActive: next });
      setProviders((prev) =>
        prev.map((p) =>
          p.id === provider.id ? { ...p, isActive: next } : p
        )
      );
    } catch (err) {
      console.error("[AdminProviders] Failed to update provider", err);
      setError("Failed to update provider status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#7C5E3C]">
        <p>Only admins can view providers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7C5E3C]">Providers</h1>
          <p className="text-sm text-[#7C5E3C]/70 max-w-xl">
            Overview of all providers on the platform. Use this page to quickly
            inspect accounts and temporarily deactivate providers when needed.
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
          <label className="flex items-center gap-2 text-xs text-[#7C5E3C]">
            <input
              type="checkbox"
              checked={onlyInactive}
              onChange={(e) => setOnlyInactive(e.target.checked)}
              className="rounded border-[#E5D3B3] text-[#BFA181]"
            />
            Show only inactive
          </label>
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
          Loading providers…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#7C5E3C]">
          <p className="text-lg font-semibold mb-1">No providers found</p>
          <p className="text-sm text-[#7C5E3C]/70">
            Try adjusting the filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl shadow-md border border-[#F5E8D3] p-4 flex flex-col gap-3 text-sm text-[#7C5E3C]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-base font-semibold">
                    {p.displayName || p.email || "Unnamed provider"}
                  </p>
                  <p className="text-xs text-[#7C5E3C]/70">
                    {p.email || "No email"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.isActive === false
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {p.isActive === false ? "Inactive" : "Active"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label="Phone" value={p.phone || "—"} />
                <InfoRow label="Address" value={p.address || "—"} />
                <InfoRow
                  label="Stripe"
                  value={formatStripe(p)}
                />
                <InfoRow
                  label="Services"
                  value={formatServices(p.services)}
                />
                <InfoRow 
                  label="Role" 
                  value={
                    <select
                      value={p.role || "provider"}
                      onChange={(e) => handleRoleChange(p.id, e.target.value)}
                      disabled={updatingRole === p.id}
                      className="text-xs font-medium bg-white border border-[#E5D3B3] rounded px-2 py-1 text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="customer">Customer</option>
                      <option value="provider">Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                  }
                />
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => toggleActive(p)}
                  disabled={updatingId === p.id}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    p.isActive === false
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                  } ${updatingId === p.id ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {updatingId === p.id
                    ? "Updating…"
                    : p.isActive === false
                    ? "Activate"
                    : "Deactivate"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow(props: { label: string; value: string | React.ReactNode }) {
  const { label, value } = props;
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-[#7C5E3C]/60">{label}</span>
      {typeof value === "string" ? (
        <span className="text-xs font-medium">{value}</span>
      ) : (
        value
      )}
    </div>
  );
}


