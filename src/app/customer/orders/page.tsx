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
        // console.log(missionsData);
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
    return order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending";
  }

  // Helper to get provider name
  function getProviderName(order: DocumentData) {
    return order.providerName || order.providerId || "N/A";
  }

  function getOrderPrice(order: DocumentData) {
    return order.price ? `${order.price}NOK` : "N/A";
  }

  return (
    <div className="min-h-screen bg-[#F5E8D3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#7C5E3C] mb-6">Your Orders</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4">
            Your Orders
          </h2>
          {loading && <p>Loading...</p>}
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          {!loading && !errorMsg && orders.length === 0 && <p>No orders found.</p>}
          {!loading && !errorMsg && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#F5E8D3]">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Provider</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#BFA181] uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-semibold text-[#7C5E3C]">{getServiceName(order)}</td>
                      <td className="px-4 py-3 text-gray-700">{getOrderDate(order)}</td>
                      <td className="px-4 py-3 text-gray-700">{getOrderTime(order)}</td>
                      <td className="px-4 py-3 text-gray-700">{getProviderName(order)}</td>
                      <td className="px-4 py-3 text-gray-700">{getOrderPrice(order)}</td>
                      <td className="px-4 py-3 text-gray-700">{getOrderStatus(order)}</td>
                      <td className="px-4 py-3 text-gray-500">{getOrderDescription(order)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
