"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import {
  FaTasks,
  FaDollarSign,
  FaUserTie,
  FaUsers,
  FaChartBar,
  FaCalendarDay,
  FaCog,
  FaUserShield,
  FaFileInvoiceDollar,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

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

  const totalMissionsCount = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 pb-8">
      {/* Header with gradient background */}
      <header className="relative bg-gradient-to-br from-[#7C5E3C] via-[#A68A64] to-[#BFA181] rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
              Admin Dashboard
            </h1>
            <p className="text-white/90 max-w-xl text-lg">
              High-level overview of missions, users and revenue to help you run
              operations smoothly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/missions"
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              View missions
            </Link>
            <Link
              href="/admin/providers"
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              Providers
            </Link>
            <Link
              href="/admin/payments"
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              Payments
            </Link>
            <Link
              href="/admin/customers"
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              Customers
            </Link>
            <Link
              href="/admin/users"
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              All Users
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          icon={<FaTasks className="w-6 h-6" />}
          label="Total missions"
          value={totalMissions}
          description="All time across all customers and providers."
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-50 to-blue-100"
        />
        <KpiCard
          icon={<FaDollarSign className="w-6 h-6" />}
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
          gradient="from-green-500 to-green-600"
          bgGradient="from-green-50 to-green-100"
        />
        <KpiCard
          icon={<FaUserTie className="w-6 h-6" />}
          label="Active providers"
          value={userCounts.providers}
          description="Users with provider role."
          gradient="from-purple-500 to-purple-600"
          bgGradient="from-purple-50 to-purple-100"
        />
        <KpiCard
          icon={<FaUsers className="w-6 h-6" />}
          label="Customers"
          value={userCounts.customers}
          description="Users with customer role."
          gradient="from-orange-500 to-orange-600"
          bgGradient="from-orange-50 to-orange-100"
        />
      </section>

      {/* Status breakdown & today summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#F5E8D3] hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#7C5E3C] to-[#BFA181] rounded-xl text-white">
              <FaChartBar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#7C5E3C]">
              Missions by status
            </h2>
          </div>
          {Object.keys(byStatus).length === 0 ? (
            <p className="text-[#7C5E3C]/70 text-sm">
              No missions found yet. Once bookings start, you&apos;ll see a
              breakdown here.
            </p>
          ) : (
            <ul className="space-y-4">
              {Object.entries(byStatus).map(([status, count]) => {
                const percentage = totalMissionsCount > 0 
                  ? Math.round((count / totalMissionsCount) * 100) 
                  : 0;
                const statusColors: Record<string, string> = {
                  pending: "bg-yellow-500",
                  accepted: "bg-blue-500",
                  completed: "bg-green-500",
                  cancelled: "bg-red-500",
                };
                const statusColor = statusColors[status.toLowerCase()] || "bg-gray-500";
                
                return (
                  <li key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium text-[#7C5E3C]">
                        {status.replace(/_/g, " ")}
                      </span>
                      <span className="font-bold text-[#7C5E3C]">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${statusColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#7C5E3C]/60">{percentage}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#F5E8D3] hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#BFA181] to-[#7C5E3C] rounded-xl text-white">
              <FaCalendarDay className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#7C5E3C]">
              Today & last 30 days
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#7C5E3C]">Missions today</span>
                <span className="text-2xl font-bold text-blue-700">{todayMissions}</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#7C5E3C]">Revenue (last 30 days)</span>
                <span className="text-xl font-bold text-green-700">
                  {revenueLast30Days
                    ? `NOK ${revenueLast30Days.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "NOK 0.00"}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[#F5E8D3]/50 rounded-lg border border-[#E5D3B3]">
              <p className="text-xs text-[#7C5E3C]/70">
                These figures are based on mission prices recorded in Firestore.
                Stripe is the source of truth for final financial reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-2xl font-bold text-[#7C5E3C] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickLinkCard
            icon={<FaSearch className="w-5 h-5" />}
            title="Review missions & disputes"
            description="Search, filter, and adjust missions if something goes wrong between customer and provider."
            href="/admin/missions"
            gradient="from-blue-500 to-cyan-500"
          />
          <QuickLinkCard
            icon={<FaUserTie className="w-5 h-5" />}
            title="Manage providers"
            description="See provider performance, Stripe status, and deactivate in case of issues."
            href="/admin/providers"
            gradient="from-purple-500 to-pink-500"
          />
          <QuickLinkCard
            icon={<FaUsers className="w-5 h-5" />}
            title="Manage customers"
            description="View customer accounts to better support them when there are issues."
            href="/admin/customers"
            gradient="from-green-500 to-emerald-500"
          />
          <QuickLinkCard
            icon={<FaUserShield className="w-5 h-5" />}
            title="Manage all users & roles"
            description="View all users and change their roles (customer, provider, admin)."
            href="/admin/users"
            gradient="from-orange-500 to-red-500"
          />
          <QuickLinkCard
            icon={<FaFileInvoiceDollar className="w-5 h-5" />}
            title="View payments"
            description="Monitor payment transactions and financial overview."
            href="/admin/payments"
            gradient="from-indigo-500 to-purple-500"
          />
          <QuickLinkCard
            icon={<FaCog className="w-5 h-5" />}
            title="Configure services & fees"
            description="Adjust the catalog and fee structure as the business evolves."
            href="/admin/settings"
            gradient="from-gray-600 to-gray-700"
          />
        </div>
      </section>
    </div>
  );
}

function KpiCard(props: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  description?: string;
  gradient: string;
  bgGradient: string;
}) {
  const { icon, label, value, description, gradient, bgGradient } = props;
  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl text-white shadow-md`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-[#7C5E3C]/70 mb-2">{label}</p>
        <p className="text-3xl font-bold text-[#7C5E3C] mb-2">{value}</p>
        {description && (
          <p className="text-xs text-[#7C5E3C]/60 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}

function QuickLinkCard(props: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
}) {
  const { icon, title, description, href, gradient } = props;
  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-[#F5E8D3] hover:-translate-y-1 overflow-hidden relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[#7C5E3C] mb-2 group-hover:text-[#A68A64] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#7C5E3C]/70 mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center text-sm font-semibold text-[#BFA181] group-hover:text-[#A68A64] transition-colors">
          <span>Open</span>
          <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}


