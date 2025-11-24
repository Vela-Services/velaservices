"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

type AdminOverviewResponse = {
  missions: {
    totalMissions: number;
    byStatus: Record<string, number>;
    revenueLast7Days: number;
    revenueLast30Days: number;
    todayMissions: number;
  };
  users: {
    providers: number;
    customers: number;
  };
};

export default function AdminDashboardPage() {
  const { loading, isAdmin } = useAuth();
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setFetching(true);
        setError(null);

        const res = await fetch("/api/admin/overview");
        if (!res.ok) {
          throw new Error("Failed to load admin overview data.");
        }
        const json = (await res.json()) as AdminOverviewResponse;
        if (!cancelled) {
          setOverview(json);
        }
      } catch (err) {
        console.error("[AdminDashboard] Failed to load data", err);
        if (!cancelled) {
          setError("Failed to load admin overview data.");
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    };

    if (isAdmin) {
      fetchData();
    }
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-[#7C5E3C]">
          <svg
            className="animate-spin h-6 w-6 text-[#BFA181]"
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
          <span className="text-lg font-medium">Loading admin overview…</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-[#7C5E3C]">
        <h1 className="text-2xl font-bold mb-2">Admin access required</h1>
        <p className="mb-4 max-w-md">
          You need an administrator account to access this backoffice. If you
          believe this is a mistake, please contact the VÉLA team.
        </p>
        <Link
          href="/home"
          className="px-5 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
        >
          Back to home
        </Link>
      </div>
    );
  }

  // Use overview from API; fall back to zeros if not yet loaded
  // to avoid crashes while still showing the error box.
  const totalMissions = overview?.missions.totalMissions ?? 0;
  const byStatus = overview?.missions.byStatus ?? {};
  const revenueLast7Days = overview?.missions.revenueLast7Days ?? 0;
  const revenueLast30Days = overview?.missions.revenueLast30Days ?? 0;
  const todayMissions = overview?.missions.todayMissions ?? 0;
  const userCounts = overview?.users ?? { providers: 0, customers: 0 };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#7C5E3C]">
            Admin Dashboard
          </h1>
          <p className="text-[#7C5E3C]/70 max-w-xl">
            High-level overview of missions, users and revenue to help you run
            operations smoothly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/missions"
            className="px-4 py-2 rounded-full bg-white border border-[#BFA181] text-[#7C5E3C] font-semibold hover:bg-[#F5E8D3] transition"
          >
            View missions
          </Link>
          <Link
            href="/admin/providers"
            className="px-4 py-2 rounded-full bg-white border border-[#BFA181] text-[#7C5E3C] font-semibold hover:bg-[#F5E8D3] transition"
          >
            Providers
          </Link>
          <Link
            href="/admin/payments"
            className="px-4 py-2 rounded-full bg-white border border-[#BFA181] text-[#7C5E3C] font-semibold hover:bg-[#F5E8D3] transition"
          >
            Payments
          </Link>
          <Link
            href="/admin/customers"
            className="px-4 py-2 rounded-full bg-white border border-[#BFA181] text-[#7C5E3C] font-semibold hover:bg-[#F5E8D3] transition"
          >
            Customers
          </Link>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total missions"
          value={totalMissions}
          description="All time across all customers and providers."
        />
        <KpiCard
          label="Revenue (last 7 days)"
          value={
            revenueLast7Days
              ? `NOK ${revenueLast7Days.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "NOK 0.00"
          }
          description="Sum of mission prices created in the last 7 days."
        />
        <KpiCard
          label="Active providers"
          value={userCounts.providers}
          description="Users with provider role."
        />
        <KpiCard
          label="Customers"
          value={userCounts.customers}
          description="Users with customer role."
        />
      </section>

      {/* Status breakdown & today summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#7C5E3C] mb-3">
            Missions by status
          </h2>
          {Object.keys(byStatus).length === 0 ? (
            <p className="text-[#7C5E3C]/70 text-sm">
              No missions found yet. Once bookings start, you&apos;ll see a
              breakdown here.
            </p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(byStatus).map(([status, count]) => (
                <li
                  key={status}
                  className="flex items-center justify-between text-sm text-[#7C5E3C]"
                >
                  <span className="capitalize">
                    {status.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#7C5E3C] mb-3">
            Today & last 30 days
          </h2>
          <div className="space-y-3 text-sm text-[#7C5E3C]">
            <div className="flex items-center justify-between">
              <span>Missions today</span>
              <span className="font-semibold">{todayMissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Revenue (last 30 days)</span>
              <span className="font-semibold">
                {revenueLast30Days
                  ? `NOK ${revenueLast30Days.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "NOK 0.00"}
              </span>
            </div>
            <p className="text-xs text-[#7C5E3C]/70 mt-2">
              These figures are based on mission prices recorded in Firestore.
              Stripe is the source of truth for final financial reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLinkCard
          title="Review missions & disputes"
          description="Search, filter, and adjust missions if something goes wrong between customer and provider."
          href="/admin/missions"
        />
        <QuickLinkCard
          title="Manage providers"
          description="See provider performance, Stripe status, and deactivate in case of issues."
          href="/admin/providers"
        />
        <QuickLinkCard
          title="Manage customers"
          description="View customer accounts to better support them when there are issues."
          href="/admin/customers"
        />
        <QuickLinkCard
          title="Configure services & fees"
          description="Adjust the catalog and fee structure as the business evolves."
          href="/admin/settings"
        />
      </section>
    </div>
  );
}

function KpiCard(props: {
  label: string;
  value: number | string;
  description?: string;
}) {
  const { label, value, description } = props;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between">
      <div>
        <p className="text-sm text-[#7C5E3C]/70">{label}</p>
        <p className="mt-2 text-2xl font-bold text-[#7C5E3C]">{value}</p>
      </div>
      {description && (
        <p className="mt-3 text-xs text-[#7C5E3C]/70">{description}</p>
      )}
    </div>
  );
}

function QuickLinkCard(props: {
  title: string;
  description: string;
  href: string;
}) {
  const { title, description, href } = props;
  return (
    <Link
      href={href}
      className="block bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow border border-transparent hover:border-[#BFA181]/60"
    >
      <h3 className="text-base font-semibold text-[#7C5E3C] mb-1">{title}</h3>
      <p className="text-xs text-[#7C5E3C]/70 mb-2">{description}</p>
      <span className="text-sm font-semibold text-[#BFA181]">Open →</span>
    </Link>
  );
}


