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
  FaMapMarkerAlt,
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
        <FaHourglassHalf className="inline" />{" "}
        {s === "Completed_by_customer" ? "Awaiting Payout" : s}
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
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// --- Modal component for cancellations ---
function CancelModal({
  open,
  onClose,
  onConfirm,
  order,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  order: DocumentData | null;
  isLoading: boolean;
}) {
  if (!open || !order) return null;

  function getRefundPreview() {
    const dateStr = order?.date || order?.missionDate || order?.serviceDate || "";
    const timeStr = order?.times || order?.missionTime || "";
    let firstTime = "00:00";
    if (typeof timeStr === "string" && timeStr.length >= 3) {
      firstTime = timeStr.split(",")[0].trim();
    } else if (Array.isArray(timeStr) && timeStr.length > 0) {
      firstTime = String(timeStr[0]);
    }
    const missionDateTime = new Date(dateStr);
    if (/^\d{1,2}:\d{2}$/.test(firstTime)) {
      const [h, m] = firstTime.split(":");
      missionDateTime.setHours(Number(h), Number(m), 0, 0);
    }

    const now = new Date();
    const msDiff = missionDateTime.getTime() - now.getTime();
    const hoursDiff = msDiff / (1000 * 60 * 60);
    if (isNaN(hoursDiff)) return { label: "-", percentage: 0 };

    let refundType = "none";
    let refundPercentage = 0;
    if (hoursDiff >= 24) {
      refundType = "full";
      refundPercentage = 1.0;
    } else if (hoursDiff >= 12) {
      refundType = "partial";
      refundPercentage = 0.5;
    } else {
      refundType = "none";
      refundPercentage = 0.0;
    }

    return {
      label:
        refundType === "full"
          ? "Full refund"
          : refundType === "partial"
          ? "Partial refund (50%)"
          : "No refund",
      value: refundPercentage * (Number(order?.price) || 0),
      percentage: refundPercentage,
      refundType,
      hoursDiff: Math.floor(hoursDiff),
    };
  }

  const preview = getRefundPreview();

  // --- fix: wrap onConfirm in an async handler so Promise is handled correctly ---
  const handleConfirmClick = async () => {
    if (typeof onConfirm === "function") {
      await onConfirm();
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full px-7 py-8 relative border border-[#F5E8D3]">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <div className="flex flex-col items-center text-center mb-3 space-y-3">
          <FaTimesCircle className="text-red-400 w-10 h-10 mb-2" />
          <h2 className="text-2xl font-bold text-[#7C5E3C] mb-0.5">
            Cancel Order?
          </h2>
          <div className="text-[#7C5E3C]/85 text-sm">
            <span>Are you sure you want to cancel this order?</span>
            <br />
            <span>
              <strong>
                {order.serviceName || order.missionName || "Service"}
              </strong>{" "}
              on{" "}
              <span className="font-mono">
                {formatDate(order.date || order.missionDate || "")}
              </span>{" "}
              {order.times && (
                <>
                  at{" "}
                  <span className="font-mono">{formatTimes(order.times)}</span>
                </>
              )}
            </span>
            <br />
            <br />
            <ul className="text-left text-xs text-[#7C5E3C] bg-[#f5e8d3]/80 rounded-lg px-3 py-2 mb-2 mx-auto max-w-[320px] leading-snug">
              <li>
                <strong>If you cancel 24 hours or more before</strong>, you get
                a <b>full refund</b>.
              </li>
              <li>
                <strong>Between 12 and 24 hours</strong>, you get a{" "}
                <b>partial refund (50%)</b>.
              </li>
              <li>
                <strong>Less than 12 hours before</strong>, <b>no refund</b>.
              </li>
            </ul>
          </div>
          <div className="py-1 flex flex-col w-full justify-center items-center text-sm">
            <div className="mb-1 text-[#BFA181] font-semibold">
              <span className="inline-flex items-center gap-1">
                <FaMoneyBillWave className="inline" /> {preview?.label}:&nbsp;
                <span className="font-bold">
                  {typeof preview?.value === "number" && preview.value > 0
                    ? `${preview.value} NOK`
                    : preview?.label}
                </span>
              </span>
            </div>
            <div className="text-xs text-gray-500">
              <span>
                (Service starts in ~
                {typeof preview?.hoursDiff === "number" && preview.hoursDiff >= 0
                  ? preview.hoursDiff
                  : 0}{" "}
                hours)
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 mt-2 justify-center">
          <button
            className="w-32 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#7C5E3C] font-semibold rounded-lg transition"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Never mind
          </button>
          <button
            onClick={handleConfirmClick}
            className={clsx(
              "w-32 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition",
              isLoading && "opacity-80 pointer-events-none animate-pulse"
            )}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
      {/* modal background close (optional) */}
      <button
        className="fixed inset-0 w-full h-full cursor-default"
        aria-label="modal-background"
        style={{ zIndex: 1, position: "fixed", background: "transparent" }}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      ></button>
    </div>
  );
}

export default function OrdersPage() {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<DocumentData[]>([]);
  const [marking, setMarking] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const [cancelModalOrder, setCancelModalOrder] = useState<DocumentData | null>(
    null
  );
  const [cancelLoading, setCancelLoading] = useState(false);

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

  function formatAtLocation(order: DocumentData) {
    const atLocationRaw = order.atLocation ?? order.at_location ?? "";
    if (!atLocationRaw) return null;
    let description = "";
    if (
      typeof atLocationRaw === "string" &&
      (atLocationRaw.toLowerCase() === "customer" ||
        atLocationRaw.toLowerCase() === "at_customer")
    ) {
      description = "At your place";
    } else if (
      typeof atLocationRaw === "string" &&
      (atLocationRaw.toLowerCase() === "provider" ||
        atLocationRaw.toLowerCase() === "at_provider")
    ) {
      description = "At the provider's place";
    } else if (typeof atLocationRaw === "string" && atLocationRaw !== "") {
      description = atLocationRaw;
    } else {
      return null;
    }
    return (
      <span className="inline-flex items-center gap-1">
        <FaMapMarkerAlt className="inline" />
        {description}
      </span>
    );
  }

  function getServiceName(order: DocumentData) {
    return order.serviceName || order.missionName || "Service";
  }

  function getOrderDate(order: DocumentData) {
    return order.date || order.missionDate || order.serviceDate || "";
  }

  function getOrderTime(order: DocumentData) {
    return order.times || order.missionTime || "";
  }

  function getOrderDescription(order: DocumentData) {
    return order.notes || order.missionDescription || order.description || "";
  }

  function getOrderStatus(order: DocumentData) {
    return (order.status || "Pending").toLowerCase();
  }

  function getProviderName(order: DocumentData) {
    return order.providerName || order.providerId || "N/A";
  }

  function getOrderPrice(order: DocumentData) {
    return order.price ? `${order.price} NOK` : "N/A";
  }

  function getSubservices(order: DocumentData) {
    return order.subservices || order.subServices || undefined;
  }

  const markMissionDone = async (missionId: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Are you sure you want to validate this order as completed?"
      )
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

      await updateDoc(missionRef, {
        status: "completed_by_customer",
        customerMarkedDoneAt: new Date(),
      });

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

  const cancelOrder = async (order: DocumentData) => {
    setCancelling(order.id);
    setErrorMsg(null);

    try {
      const dateStr = getOrderDate(order);
      if (!dateStr) throw new Error("Order date not found");
      const timeStr = getOrderTime(order);
      let firstTime = "00:00";
      if (typeof timeStr === "string" && timeStr.length >= 3) {
        firstTime = timeStr.split(",")[0].trim();
      } else if (Array.isArray(timeStr) && timeStr.length > 0) {
        firstTime = String(timeStr[0]);
      }
      const missionDateTime = new Date(dateStr);
      if (/^\d{1,2}:\d{2}$/.test(firstTime)) {
        const [h, m] = firstTime.split(":");
        missionDateTime.setHours(Number(h), Number(m), 0, 0);
      }

      const now = new Date();
      const msDiff = missionDateTime.getTime() - now.getTime();
      const hoursDiff = msDiff / (1000 * 60 * 60);

      let refundType = "none";
      let refundPercentage = 0;
      if (hoursDiff >= 24) {
        refundType = "full";
        refundPercentage = 1.0;
      } else if (hoursDiff >= 12) {
        refundType = "partial";
        refundPercentage = 0.5;
      } else {
        refundType = "none";
        refundPercentage = 0.0;
      }

      const res = await fetch("/api/stripe/refund-on-cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: order.stripePaymentIntentId,
          orderId: order.id,
          refundType,
          refundPercentage,
          fullPrice: order.price,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Refund/cancellation failed");
      }

      const missionRef = doc(db, "missions", order.id);
      await updateDoc(missionRef, {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationRefundType: refundType,
        cancellationRefundId: data.refundId ?? null,
        cancellationRefundResult: data,
      });

      toast.success(
        refundType === "full"
          ? "Order cancelled. Full refund processed!"
          : refundType === "partial"
          ? "Order cancelled. Partial refund processed."
          : "Order cancelled. No refund as cancellation was too late."
      );
      setTimeout(() => handleRefresh(), 1000);
    } catch (err) {
      setErrorMsg((err as Error).message || "Failed to cancel order");
      toast.error((err as Error).message || "Failed to cancel order");
    } finally {
      setCancelling(null);
      setCancelModalOrder(null);
      setCancelLoading(false);
    }
  };

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

  const upcomingOrders = useMemo(() => {
    return filteredOrders
      .filter((order) => {
        const status = getOrderStatus(order);
        if (
          status === "cancelled" ||
          status === "paid_out" ||
          status === "completed" ||
          status === "done"
        )
          return false;
        const dateStr = getOrderDate(order);
        if (!dateStr) return true;
        const date = new Date(dateStr);
        return (
          date >= now ||
          status === "pending" ||
          status === "completed_by_customer"
        );
      })
      .sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex flex-col items-center py-10 px-2">
      <CancelModal
        open={!!cancelModalOrder}
        onClose={() => {
          if (!cancelLoading) setCancelModalOrder(null);
        }}
        onConfirm={async () => {
          if (!cancelModalOrder) return;
          setCancelLoading(true);
          // Awaiting cancelOrder as a promise: ensures modal button properly awaits
          await cancelOrder(cancelModalOrder);
          setCancelLoading(false);
        }}
        order={cancelModalOrder}
        isLoading={cancelLoading}
      />

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
                Welcome! Here you can track your upcoming and past service
                orders, see details, and manage your bookings.
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
                        {formatTimes(getOrderTime(order)) || (
                          <span className="text-gray-400">No time</span>
                        )}
                      </span>
                      {formatAtLocation(order) && (
                        <span className="inline-flex items-center gap-1">
                          {formatAtLocation(order)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <FaUser className="inline" />
                        {getProviderName(order)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaMoneyBillWave className="inline" />
                        {getOrderPrice(order)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      {formatStatus(order.status)}
                    </div>
                    {/* Action Buttons */}
                    {tab === "upcoming" &&
                      status !== "paid_out" &&
                      status !== "cancelled" &&
                      status !== "completed" &&
                      status !== "done" && (
                        <div className="flex flex-col gap-2 mt-4">
                          <button
                            disabled={marking === orderId}
                            onClick={() => markMissionDone(orderId)}
                            className={clsx(
                              "w-full bg-[#BFA181] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#A68A6E] transition disabled:opacity-50",
                              marking === orderId && "animate-pulse"
                            )}
                          >
                            {marking === orderId
                              ? "Processing..."
                              : "Mark as Done"}
                          </button>
                          <button
                            disabled={cancelLoading || cancelling === orderId}
                            onClick={() => {
                              setCancelModalOrder(order);
                              setCancelling(null); // Make sure to reset cancelling so modal control works
                            }}
                            className={clsx(
                              "w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50",
                              (cancelLoading || cancelling === orderId) &&
                                "animate-pulse"
                            )}
                          >
                            {cancelling === orderId ||
                            (cancelModalOrder &&
                              cancelModalOrder.id === orderId &&
                              cancelLoading)
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
