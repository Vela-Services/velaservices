"use client";

import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMoneyBillWave,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSearch,
  FaRedo,
  FaHistory,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
} from "react-icons/fa";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import clsx from "clsx";

// --- Unused functions to be used ---
function formatTimes(times: string[] | string) {
  if (Array.isArray(times)) return times.join(", ");
  return times;
}

function getStatusSortOrder(status: string) {
  // For sorting: Upcoming > Pending > Awaiting Payout > Paid Out > Completed > Cancelled
  switch (status?.toLowerCase()) {
    case "pending":
      return 1;
    case "completed_by_customer":
      return 2;
    case "paid_out":
    case "completed":
    case "done":
      return 3;
    case "cancelled":
      return 4;
    default:
      return 5;
  }
}
// --- End unused functions ---

function formatStatus(status: string) {
  if (!status)
    return (
      <span className="inline-flex items-center gap-1 text-yellow-600">
        <FaHourglassHalf className="inline" /> Pending
      </span>
    );
  const s = status.charAt(0).toUpperCase() + status.slice(1);
  if (s === "Completed" || s === "Done" || s === "Paid_out")
    return (
      <span className="inline-flex items-center gap-1 text-green-600">
        <FaCheckCircle className="inline" /> {s === "Paid_out" ? "Paid Out" : s}
      </span>
    );
  if (s === "Cancelled")
    return (
      <span className="inline-flex items-center gap-1 text-red-500">
        <FaTimesCircle className="inline" /> {s}
      </span>
    );
  if (s === "Pending" || s === "Completed_by_customer")
    return (
      <span className="inline-flex items-center gap-1 text-yellow-600">
        <FaHourglassHalf className="inline" /> {s === "Completed_by_customer" ? "Awaiting Payout" : s}
      </span>
    );
  return s;
}

function formatSubservices(subservices: Record<string, number> | undefined) {
  if (!subservices || Object.keys(subservices).length === 0) return null;
  return (
    <div className="mt-1 text-xs text-[#7C5E3C]/80">
      <span className="font-semibold">Subservices:</span>{" "}
      {Object.entries(subservices)
        .map(([name, hours]) => `${name} (${hours}h)`)
        .join(", ")}
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}


export default function OrdersPage() {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<DocumentData[]>([]);
  const [marking, setMarking] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchMissions = async (user: User) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const missionsSnapshot = await getDocs(
          query(collection(db, "missions"), where("userId", "==", user.uid))
        );
        const missionsData = missionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(missionsData);
      } catch (error) {
        console.error("Failed to fetch orders.", error);
        setErrorMsg("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchMissions(firebaseUser);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Helper to get a display name for the service
  function getServiceName(order: DocumentData) {
    return order.serviceName || order.missionName || "Service";
  }

  // Helper to get a display date
  function getOrderDate(order: DocumentData) {
    return order.date || order.missionDate || order.serviceDate || "";
  }

  // Helper to get a display time
  function getOrderTime(order: DocumentData) {
    return order.times || order.missionTime || "";
  }

  // Helper to get a description/notes
  function getOrderDescription(order: DocumentData) {
    return order.notes || order.missionDescription || order.description || "";
  }

  // Helper to get status
  function getOrderStatus(order: DocumentData) {
    return (order.status || "Pending").toLowerCase();
  }

  // Helper to get provider name
  function getProviderName(order: DocumentData) {
    return order.providerName || order.providerId || "N/A";
  }

  function getOrderPrice(order: DocumentData) {
    return order.price ? `${order.price} NOK` : "N/A";
  }

  // Helper to get subservices
  function getSubservices(order: DocumentData) {
    return order.subservices || order.subServices || undefined;
  }

  // Only customer validation, with confirmation dialog
  const markMissionDone = async (missionId: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Are you sure you want to validate this order as completed?")
    ) {
      return;
    }

    setMarking(missionId);
    setErrorMsg(null);

    try {
      const missionRef = doc(db, "missions", missionId);
      const missionSnap = await getDoc(missionRef);
      const mission = missionSnap.data();

      if (!mission) {
        toast.error("Mission not found");
        throw new Error("Mission not found");
      }

      // Step 1: Mark mission as completed_by_customer
      await updateDoc(missionRef, {
        status: "completed_by_customer",
        customerMarkedDoneAt: new Date(),
      });

      // Step 2: Log Stripe transfer call
      const payoutRes = await fetch("/api/stripe/transfer-to-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: mission.price,
          stripeAccountId: mission.stripeAccountId,
          missionId: missionId,
          paymentIntentId: mission.stripePaymentIntentId,
          description: `Mission ${missionId} payout`,
        }),
      });

      const payoutData = await payoutRes.json();

      if (!payoutRes.ok) {
        throw new Error(payoutData.error || "Payout failed");
      }

      // Step 3: Update Firestore with transfer info
      await updateDoc(missionRef, {
        status: "paid_out",
        transferId: payoutData.transferId,
        payoutAt: new Date(),
      });

      toast.success("Mission marked as completed! And payment sent.");
    } catch (err) {
      setErrorMsg((err as Error).message || "Failed to mark mission as done");
      toast.error((err as Error).message || "Failed to mark mission as done");
    } finally {
      setMarking(null);
    }
  };

  // Filtering and sorting
  const now = useMemo(() => new Date(), []);
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((order) =>
        [
          getServiceName(order),
          getProviderName(order),
          getOrderDescription(order),
          getOrderDate(order),
          getOrderTime(order),
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    return filtered;
  }, [orders, search]);

  // Use getStatusSortOrder in sorting
  const upcomingOrders = useMemo(() => {
    return filteredOrders
      .filter((order) => {
        const status = getOrderStatus(order);
        if (status === "cancelled" || status === "paid_out" || status === "completed" || status === "done") return false;
        // If date is in the future or status is pending/completed_by_customer
        const dateStr = getOrderDate(order);
        if (!dateStr) return true;
        const date = new Date(dateStr);
        return date >= now || status === "pending" || status === "completed_by_customer";
      })
      .sort((a, b) => {
        // Sort by status, then by date ascending
        const statusA = getStatusSortOrder(getOrderStatus(a));
        const statusB = getStatusSortOrder(getOrderStatus(b));
        if (statusA !== statusB) return statusA - statusB;
        const da = new Date(getOrderDate(a));
        const db = new Date(getOrderDate(b));
        if (isNaN(da.getTime()) || isNaN(db.getTime())) return 0;
        return da.getTime() - db.getTime();
      });
  }, [filteredOrders, now]);

  const historyOrders = useMemo(() => {
    return filteredOrders
      .filter((order) => {
        const status = getOrderStatus(order);
        return (
          status === "paid_out" ||
          status === "completed" ||
          status === "done" ||
          status === "cancelled"
        );
      })
      .sort((a, b) => {
        // Sort by status, then by date descending
        const statusA = getStatusSortOrder(getOrderStatus(a));
        const statusB = getStatusSortOrder(getOrderStatus(b));
        if (statusA !== statusB) return statusA - statusB;
        const da = new Date(getOrderDate(a));
        const db = new Date(getOrderDate(b));
        if (isNaN(da.getTime()) || isNaN(db.getTime())) return 0;
        return db.getTime() - da.getTime();
      });
  }, [filteredOrders]);

  const displayedOrders = tab === "upcoming" ? upcomingOrders : historyOrders;

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const missionsSnapshot = await getDocs(
        query(collection(db, "missions"), where("userId", "==", user.uid))
      );
      const missionsData = missionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(missionsData);
      toast.success("Orders refreshed!");
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to refresh orders.");
      toast.error("Failed to refresh orders.");
    } finally {
      setRefreshing(false);
    }
  };


  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#BFA181] rounded-full p-4 shadow-lg">
              <FaRegCalendarCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-[#7C5E3C] mb-1 tracking-tight">
                My Service Dashboard
              </h1>
              <p className="text-[#7C5E3C]/70 text-lg max-w-xl">
                Welcome! Here you can track your upcoming and past service orders, see details, and manage your bookings.
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#BFA181] text-white font-semibold shadow hover:bg-[#A68A6E] transition disabled:opacity-50",
                refreshing && "animate-spin-slow"
              )}
              title="Refresh"
            >
              <FaRedo className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition",
                tab === "upcoming"
                  ? "bg-[#BFA181] text-white shadow"
                  : "bg-white/80 text-[#7C5E3C] hover:bg-[#f5e8d3]"
              )}
              onClick={() => setTab("upcoming")}
            >
              <FaRegCalendarCheck />
              Upcoming
            </button>
            <button
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition",
                tab === "history"
                  ? "bg-[#BFA181] text-white shadow"
                  : "bg-white/80 text-[#7C5E3C] hover:bg-[#f5e8d3]"
              )}
              onClick={() => setTab("history")}
            >
              <FaHistory />
              History
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow">
            <FaSearch className="text-[#BFA181]" />
            <input
              type="text"
              placeholder="Search orders, provider, date..."
              className="bg-transparent outline-none text-[#7C5E3C] w-48 md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Main Card Area */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 min-h-[400px]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="animate-spin h-10 w-10 text-[#BFA181]"
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
              <span className="mt-4 text-[#BFA181] font-medium text-lg">
                Loading your orders...
              </span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3 mb-4 text-center">
              {errorMsg}
            </div>
          )}
          {!loading && !errorMsg && displayedOrders.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <FaRegCalendarTimes className="w-16 h-16 mb-4 text-[#BFA181]" />
              <h2 className="text-2xl font-semibold mb-2 text-[#7C5E3C]">
                {tab === "upcoming" ? "No upcoming orders" : "No order history"}
              </h2>
              <p className="mb-4 text-[#7C5E3C]/80 text-center">
                {tab === "upcoming"
                  ? "You have no upcoming service orders. Book a new service to get started!"
                  : "No past orders found. Your completed and cancelled orders will appear here."}
              </p>
            </div>
          )}
          {!loading && !errorMsg && displayedOrders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedOrders.map((order) => {
               
                const status = getOrderStatus(order);
                // Defensive: ensure order.id is defined
                const orderId = order.id ?? "";
                return (
                  <div
                    key={orderId}
                    className={clsx(
                      "relative border border-[#F5E8D3] rounded-xl shadow-md p-5 flex flex-col bg-white/95 hover:shadow-lg transition group",
                        "ring-2 ring-[#BFA181]/40"
                    )}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-[#7C5E3C]">
                          {getServiceName(order)}
                        </span>
                        {formatSubservices(getSubservices(order))}
                      </div>
                     
                    </div>
                    {/* Card Meta */}
                    <div className="flex flex-wrap gap-3 text-[#7C5E3C]/90 text-sm mt-2 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <FaCalendarAlt className="inline" />
                        {formatDate(getOrderDate(order)) || (
                          <span className="text-gray-400">No date</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaClock className="inline" />
                        {/* Use formatTimes here to utilize the unused function */}
                        {formatTimes(getOrderTime(order)) || (
                          <span className="text-gray-400">No time</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaUser className="inline" />
                        {getProviderName(order)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaMoneyBillWave className="inline" />
                        {getOrderPrice(order)}
                      </span>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      {formatStatus(order.status)}
                    </div>
                    
                    {/* Action Button */}
                    {tab === "upcoming" &&
                      status !== "paid_out" &&
                      status !== "cancelled" &&
                      status !== "completed" &&
                      status !== "done" && (
                        <button
                          disabled={marking === orderId}
                          onClick={() => markMissionDone(orderId)}
                          className={clsx(
                            "mt-4 w-full bg-[#BFA181] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#A68A6E] transition disabled:opacity-50",
                            marking === orderId && "animate-pulse"
                          )}
                        >
                          {marking === orderId
                            ? "Processing..."
                            : "Mark as Done"}
                        </button>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Custom styles for slow spin */}
      <style>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
