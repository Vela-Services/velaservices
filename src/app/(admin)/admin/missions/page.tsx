"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/app/hooks/useAuth";

type MissionStatus =
  | "pending"
  | "assigned"
  | "completed"
  | "completed_by_customer"
  | "paid_out"
  | "cancelled"
  | string;

type Mission = {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  providerId?: string;
  providerName?: string;
  serviceName?: string;
  date?: string;
  times?: string[] | string;
  price?: number;
  status?: MissionStatus;
  stripePaymentIntentId?: string;
  stripeAccountId?: string;
  transferId?: string;
  adminNotes?: { by: string; at: string; note: string }[];
};

const STATUS_OPTIONS: { value: MissionStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "completed_by_customer", label: "Awaiting payout" },
  { value: "paid_out", label: "Paid out" },
  { value: "cancelled", label: "Cancelled" },
];

function AdminMissionsContent() {
  const { user, isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filterStatus, setFilterStatus] =
    useState<MissionStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize search from query param (?search=...)
  useEffect(() => {
    const initial = searchParams?.get("search");
    if (initial) {
      setSearch(initial);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/missions");
        if (!res.ok) {
          throw new Error("Failed to load missions.");
        }
        const json = (await res.json()) as { missions: Mission[] };
        if (!cancelled) {
          setMissions(json.missions || []);
        }
      } catch (err) {
        console.error("[AdminMissions] Failed to fetch missions", err);
        if (!cancelled) setError("Failed to load missions.");
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
    let list = missions;
    if (filterStatus !== "all") {
      list = list.filter((m) => (m.status || "pending") === filterStatus);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((m) =>
        [
          m.id,
          m.userName,
          m.userEmail,
          m.providerName,
          m.providerId,
          m.serviceName,
          m.date,
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    return list;
  }, [missions, filterStatus, search]);

  const handleStatusChange = async (mission: Mission, newStatus: MissionStatus) => {
    if (!user || !isAdmin) return;
    const confirm = window.confirm(
      `Change status of mission ${mission.id} to "${newStatus}"?`
    );
    if (!confirm) return;

    setUpdatingId(mission.id);
    setError(null);
    try {
      const ref = doc(db, "missions", mission.id);
      const note = `Status changed from "${mission.status ||
        "unknown"}" to "${newStatus}" by admin ${user.uid}`;
      await updateDoc(ref, {
        status: newStatus,
        adminNotes: [
          ...(mission.adminNotes || []),
          {
            by: user.uid,
            at: new Date().toISOString(),
            note,
          },
        ],
      });
      setMissions((prev) =>
        prev.map((m) =>
          m.id === mission.id ? { ...m, status: newStatus } : m
        )
      );
    } catch (err) {
      console.error("[AdminMissions] Failed to update mission", err);
      setError("Failed to update mission status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#7C5E3C]">
        <p>Only admins can view missions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7C5E3C]">
            Missions & disputes
          </h1>
          <p className="text-sm text-[#7C5E3C]/70 max-w-xl">
            Search and review all missions. Use this view when you need to
            resolve issues between customers and providers.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as MissionStatus | "all")
            }
            className="px-3 py-2 border border-[#E5D3B3] rounded-lg text-sm text-[#7C5E3C] bg-white"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by ID, name, email…"
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
          Loading missions…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#7C5E3C]">
          <p className="text-lg font-semibold mb-1">No missions found</p>
          <p className="text-sm text-[#7C5E3C]/70">
            Try adjusting the filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="bg-white rounded-2xl shadow-md border border-[#F5E8D3] p-4 flex flex-col gap-3 text-sm text-[#7C5E3C]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-[#7C5E3C]/60">Mission ID</p>
                  <p className="font-mono text-xs">{m.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#7C5E3C]/60">Status</p>
                  <p className="font-semibold capitalize">
                    {(m.status || "pending").replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InfoRow label="Service" value={m.serviceName || "—"} />
                <InfoRow label="Date" value={m.date || "—"} />
                <InfoRow
                  label="Time"
                  value={
                    Array.isArray(m.times)
                      ? m.times.join(", ")
                      : (m.times as string) || "—"
                  }
                />
                <InfoRow
                  label="Price"
                  value={
                    typeof m.price === "number"
                      ? `NOK ${m.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "—"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InfoRow
                  label="Customer"
                  value={m.userName || m.userId || "—"}
                />
                <InfoRow
                  label="Provider"
                  value={m.providerName || m.providerId || "—"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <InfoRow
                  label="Payment Intent"
                  value={m.stripePaymentIntentId || "—"}
                  mono
                />
                <InfoRow
                  label="Stripe account"
                  value={m.stripeAccountId || "—"}
                  mono
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center mt-1">
                <label className="text-xs text-[#7C5E3C]/70">
                  Change status:
                </label>
                <select
                  value={m.status || "pending"}
                  onChange={(e) =>
                    handleStatusChange(
                      m,
                      e.target.value as MissionStatus
                    )
                  }
                  disabled={updatingId === m.id}
                  className="px-2 py-1 border border-[#E5D3B3] rounded-lg text-xs bg-white"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {updatingId === m.id && (
                  <span className="text-xs text-[#7C5E3C]/70">
                    Saving…
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow(props: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const { label, value, mono } = props;
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-[#7C5E3C]/60">{label}</span>
      <span
        className={`text-xs font-medium ${
          mono ? "font-mono break-all" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function AdminMissionsPage() {
  return (
    <Suspense fallback={
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
        Loading missions…
      </div>
    }>
      <AdminMissionsContent />
    </Suspense>
  );
}

