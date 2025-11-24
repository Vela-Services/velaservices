import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit, orderBy, DocumentData } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { IoCalendarOutline, IoTimeOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import Link from "next/link";

export function ProfileActivity() {
  const [recentOrders, setRecentOrders] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const missionsQuery = query(
          collection(db, "missions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        
        const snapshot = await getDocs(missionsQuery);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setRecentOrders(orders);
      } catch (error) {
        // If orderBy fails (no index), try without it
        try {
          const missionsQuery = query(
            collection(db, "missions"),
            where("userId", "==", user.uid),
            limit(3)
          );
          
          const snapshot = await getDocs(missionsQuery);
          const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          // Sort manually by createdAt if available
          orders.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          });
          
          setRecentOrders(orders.slice(0, 3));
        } catch (fallbackError) {
          console.error("Error fetching recent orders:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">Recent Activity</h3>
        <div className="bg-white/60 backdrop-blur-xl rounded-lg p-3 border border-white/20">
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (recentOrders.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">Recent Activity</h3>
        <div className="bg-white/60 backdrop-blur-xl rounded-lg p-3 border border-white/20">
          <p className="text-xs text-gray-600 text-center">
            No recent orders. <Link href="/customerServices" className="text-[#3d676d] hover:underline font-medium">Book a service</Link> to get started!
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatStatus = (status: string) => {
    if (!status) return "Pending";
    const s = status.charAt(0).toUpperCase() + status.slice(1);
    return s.replace(/_/g, " ");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
        <Link 
          href="/orders" 
          className="text-xs text-[#3d676d] hover:underline font-medium"
        >
          View all
        </Link>
      </div>
      <div className="space-y-1.5">
        {recentOrders.slice(0, 2).map((order) => (
          <Link
            key={order.id}
            href="/orders"
            className="block bg-white/60 backdrop-blur-xl rounded-lg p-2.5 border border-white/20 hover:bg-white/80 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <IoCheckmarkCircleOutline 
                    className={`flex-shrink-0 ${
                      order.status === "completed" || order.status === "paid_out"
                        ? "text-green-500"
                        : order.status === "cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                    size={14}
                  />
                  <span className="font-medium text-xs text-gray-800 truncate">
                    {order.serviceName || order.missionName || "Service"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-0.5">
                    <IoCalendarOutline size={10} />
                    {formatDate(order.date || order.missionDate)}
                  </span>
                  {order.times && (
                    <span className="flex items-center gap-0.5">
                      <IoTimeOutline size={10} />
                      {Array.isArray(order.times) 
                        ? order.times[0] 
                        : String(order.times).split(",")[0]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  order.status === "completed" || order.status === "paid_out"
                    ? "bg-green-100 text-green-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {formatStatus(order.status)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

