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
  isActive?: boolean;
};

export default function AdminUsersPage() {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch all users
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          throw new Error("Failed to load users.");
        }
        const json = (await res.json()) as { users: AdminUser[] };
        if (!cancelled) setUsers(json.users || []);
      } catch (err) {
        console.error("[AdminUsers] Failed to load users", err);
        if (!cancelled) setError("Failed to load users.");
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
    let list = users;
    
    // Filter by role
    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    
    // Filter by search
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((u) =>
        [
          u.displayName,
          u.email,
          u.phone,
          u.address,
          u.role,
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    
    return list;
  }, [users, search, roleFilter]);

  const roleCounts = useMemo(() => {
    const counts = { customer: 0, provider: 0, admin: 0, none: 0 };
    users.forEach((u) => {
      if (u.role === "customer") counts.customer++;
      else if (u.role === "provider") counts.provider++;
      else if (u.role === "admin") counts.admin++;
      else counts.none++;
    });
    return counts;
  }, [users]);

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
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("[AdminUsers] Failed to update role", err);
      setError(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setUpdatingRole(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#7C5E3C]">
        <p>Only admins can view users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7C5E3C]">All Users</h1>
          <p className="text-sm text-[#7C5E3C]/70 max-w-xl">
            Manage all users and their roles. Change roles to make someone a customer, provider, or admin.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-[#E5D3B3] rounded-lg text-sm text-[#7C5E3C] bg-white"
          >
            <option value="all">All roles</option>
            <option value="customer">Customers ({roleCounts.customer})</option>
            <option value="provider">Providers ({roleCounts.provider})</option>
            <option value="admin">Admins ({roleCounts.admin})</option>
            <option value="">No role ({roleCounts.none})</option>
          </select>
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
          Loading users…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#7C5E3C]">
          <p className="text-lg font-semibold mb-1">No users found</p>
          <p className="text-sm text-[#7C5E3C]/70">
            Try adjusting the filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((u) => (
            <article
              key={u.id}
              className="bg-white rounded-2xl shadow-md border border-[#F5E8D3] p-4 flex flex-col gap-3 text-sm text-[#7C5E3C]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-base font-semibold">
                    {u.displayName || u.email || "Unnamed user"}
                  </p>
                  <p className="text-xs text-[#7C5E3C]/70">
                    {u.email || "No email"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    u.role === "admin"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : u.role === "provider"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : u.role === "customer"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : "No role"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label="Phone" value={u.phone || "—"} />
                <InfoRow label="Address" value={u.address || "—"} />
                <InfoRow 
                  label="Role" 
                  value={
                    <select
                      value={u.role || ""}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={updatingRole === u.id}
                      className="text-xs font-medium bg-white border border-[#E5D3B3] rounded px-2 py-1 text-[#7C5E3C] focus:outline-none focus:ring-2 focus:ring-[#BFA181] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">No role</option>
                      <option value="customer">Customer</option>
                      <option value="provider">Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                  }
                />
                {u.role === "provider" && (
                  <InfoRow 
                    label="Status" 
                    value={
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.isActive === false
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {u.isActive === false ? "Inactive" : "Active"}
                      </span>
                    }
                  />
                )}
              </div>

              <div className="mt-2 flex gap-2">
                {u.role === "customer" && (
                  <Link
                    href={`/admin/missions?search=${encodeURIComponent(
                      u.email || u.displayName || u.id
                    )}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-[#BFA181] text-xs font-semibold text-[#7C5E3C] hover:bg-[#F5E8D3] transition"
                  >
                    View missions
                  </Link>
                )}
                {updatingRole === u.id && (
                  <span className="inline-flex items-center px-3 py-1.5 text-xs text-[#7C5E3C]/70">
                    Updating...
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

