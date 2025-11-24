"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

type Mission = {
  id: string;
  price?: number;
  status?: string;
  serviceName?: string;
  date?: string;
  userName?: string;
  providerName?: string;
  stripePaymentIntentId?: string;
  stripeAccountId?: string;
  transferId?: string;
  cancellationRefundType?: string;
};

type PaymentFilter = "all" | "awaiting_payout" | "paid_out" | "cancelled_refunded";

type PaymentsApiResponse = {
  missions: Mission[];
  totals: {
    gross: number;
    paidOut: number;
    awaiting: number;
  };
};

export default function AdminPaymentsPage() {
  const { isAdmin } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [totals, setTotals] = useState<{ gross: number; paidOut: number; awaiting: number }>({
    gross: 0,
    paidOut: 0,
    awaiting: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PaymentFilter>("all");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/payments");
        if (!res.ok) {
          throw new Error("Failed to load payments overview.");
        }
        const json = (await res.json()) as PaymentsApiResponse;
        if (!cancelled) {
          setMissions(json.missions);
          setTotals(json.totals);
        }
      } catch (err) {
        console.error("[AdminPayments] Failed to load payments view", err);
        if (!cancelled) setError("Failed to load payments overview.");
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
    return missions.filter((m) => {
      const status = (m.status || "").toLowerCase();
      if (filter === "awaiting_payout") {
        return status === "completed_by_customer";
      }
      if (filter === "paid_out") {
        return status === "paid_out";
      }
      if (filter === "cancelled_refunded") {
        return status === "cancelled" || !!m.cancellationRefundType;
      }
      return true;
    });
  }, [missions, filter]);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#7C5E3C]">
        <p>Only admins can view payments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7C5E3C]">Payments</h1>
          <p className="text-sm text-[#7C5E3C]/70 max-w-xl">
            High-level view of mission payments and payouts. Use this to see
            which missions are awaiting payout, already paid, or cancelled with
            refunds.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as PaymentFilter)}
            className="px-3 py-2 border border-[#E5D3B3] rounded-lg text-sm text-[#7C5E3C] bg-white"
          >
            <option value="all">All</option>
            <option value="awaiting_payout">Awaiting payout</option>
            <option value="paid_out">Paid out</option>
            <option value="cancelled_refunded">Cancelled / refunded</option>
          </select>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Gross mission value (all time)"
          value={totals.gross}
        />
        <SummaryCard
          label="Missions paid out"
          value={totals.paidOut}
        />
        <SummaryCard
          label="Awaiting payout"
          value={totals.awaiting}
        />
      </section>

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
          Loading payments…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#7C5E3C]">
          <p className="text-lg font-semibold mb-1">No missions match this filter</p>
          <p className="text-sm text-[#7C5E3C]/70">
            Try a different payment status filter.
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
                    {(m.status || "unknown").replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label="Service" value={m.serviceName || "—"} />
                <InfoRow label="Date" value={m.date || "—"} />
                <InfoRow
                  label="Customer"
                  value={m.userName || "—"}
                />
                <InfoRow
                  label="Provider"
                  value={m.providerName || "—"}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
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
                <InfoRow
                  label="Refund type"
                  value={m.cancellationRefundType || "—"}
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
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard(props: { label: string; value: number }) {
  const { label, value } = props;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between">
      <p className="text-sm text-[#7C5E3C]/70">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#7C5E3C]">
        NOK{" "}
        {value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
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


