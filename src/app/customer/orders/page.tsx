"use client";

import { useEffect, useState } from "react";
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
  FaStickyNote,
  FaMoneyBillWave,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

function formatTimes(times: string[] | string) {
  if (Array.isArray(times)) return times.join(", ");
  return times;
}

function formatStatus(status: string) {
  if (!status) return (
    <span className="inline-flex items-center gap-1 text-yellow-600">
      <FaHourglassHalf className="inline" /> Pending
    </span>
  );
  const s = status.charAt(0).toUpperCase() + status.slice(1);
  if (s === "Completed" || s === "Done")
    return (
      <span className="inline-flex items-center gap-1 text-green-600">
        <FaCheckCircle className="inline" /> {s}
      </span>
    );
  if (s === "Cancelled")
    return (
      <span className="inline-flex items-center gap-1 text-red-500">
        <FaTimesCircle className="inline" /> {s}
      </span>
    );
  if (s === "Pending")
    return (
      <span className="inline-flex items-center gap-1 text-yellow-600">
        <FaHourglassHalf className="inline" /> {s}
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

export default function OrdersPage() {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<DocumentData[]>([]);

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
    return (
      order.notes ||
      order.missionDescription ||
      order.description ||
      ""
    );
  }

  // Helper to get status
  function getOrderStatus(order: DocumentData) {
    return order.status || "Pending";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#BFA181] rounded-full p-4 shadow-lg mb-3">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-[#7C5E3C] mb-1 tracking-tight">
            Your Orders
          </h1>
          <p className="text-[#7C5E3C]/70 text-lg text-center max-w-md">
            Here you can review your past and upcoming service orders, their details, and status.
          </p>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-lg p-8">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-[#BFA181]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="ml-3 text-[#BFA181] font-medium">Loading your orders...</span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3 mb-4">
              {errorMsg}
            </div>
          )}
          {!loading && !errorMsg && orders.length === 0 && (
            <div className="flex flex-col items-center py-8">
              <svg
                className="w-16 h-16 mb-4 text-[#BFA181]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
                />
              </svg>
              <h2 className="text-2xl font-semibold mb-2 text-[#7C5E3C]">
                No orders found
              </h2>
              <p className="mb-4 text-[#7C5E3C]/80 text-center">
                You haven't placed any service orders yet.
              </p>
            </div>
          )}
          {!loading && !errorMsg && orders.length > 0 && (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#F5E8D3] rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-[#7C5E3C]">
                        {getServiceName(order)}
                      </span>
                      {formatSubservices(getSubservices(order))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[#7C5E3C]/90 text-sm mb-2">
                      <span className="inline-flex items-center gap-1">
                        <FaCalendarAlt className="inline" />
                        {getOrderDate(order) || <span className="text-gray-400">No date</span>}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaClock className="inline" />
                        {formatTimes(getOrderTime(order)) || <span className="text-gray-400">No time</span>}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaUser className="inline" />
                        {getProviderName(order)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaMoneyBillWave className="inline" />
                        {getOrderPrice(order)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {formatStatus(getOrderStatus(order))}
                      </span>
                    </div>
                    {getOrderDescription(order) && (
                      <div className="flex items-center gap-2 text-[#7C5E3C]/80 text-xs mt-1">
                        <FaStickyNote className="inline" />
                        <span>{getOrderDescription(order)}</span>
                      </div>
                    )}
                  </div>
                  {/* Optionally, add more details or actions here */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
