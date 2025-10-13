"use client";

import { useEffect, useState, useMemo } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import {
  MdOutlineCleaningServices,
  MdOutlinePets,
  MdChildCare,
} from "react-icons/md";
import { LuCookingPot } from "react-icons/lu";
import { FiPhone, FiMapPin, FiUser, FiMail, FiFileText, FiClock, FiDollarSign, FiHome, FiMap } from "react-icons/fi";

// --- Confirmation Modal ---
type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mission?: unknown;
};

function ConfirmModal({ open, onClose, onConfirm }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#7C5E3C] mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#BFA181]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          Confirm Mission Acceptance
        </h3>
        <p className="text-[#7C5E3C] mb-4">
          Are you sure you want to accept this mission? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-[#7C5E3C] font-semibold hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
            onClick={onConfirm}
          >
            Yes, Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Calendar (unchanged) ---
function Calendar({
  missionsByDate,
  selectedDate,
  setSelectedDate,
}: {
  missionsByDate: { [date: string]: DocumentData[] };
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}) {
  // ... (unchanged)
  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : today;
  const year = selected.getFullYear();
  const month = selected.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  function fmt(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[#7C5E3C] text-lg">
          {selected.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        {/* Month navigation */}
        <div className="flex gap-2">
          <button
            className="px-2 py-1 rounded hover:bg-[#F5E8D3]"
            onClick={() => {
              const prevMonth = new Date(year, month - 1, 1);
              setSelectedDate(
                fmt(prevMonth.getFullYear(), prevMonth.getMonth(), 1)
              );
            }}
            aria-label="Previous month"
          >
            &lt;
          </button>
          <button
            className="px-2 py-1 rounded hover:bg-[#F5E8D3]"
            onClick={() => {
              const nextMonth = new Date(year, month + 1, 1);
              setSelectedDate(
                fmt(nextMonth.getFullYear(), nextMonth.getMonth(), 1)
              );
            }}
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-[#BFA181] mb-1">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const dateStr = fmt(year, month, day);
          const hasMissions = missionsByDate[dateStr]?.length > 0;
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={idx}
              className={`aspect-square rounded-lg text-sm font-medium transition
                ${
                  isSelected
                    ? "bg-[#BFA181] text-white"
                    : "bg-[#F9F5EF] text-[#7C5E3C]"
                }
                ${hasMissions ? "border-2 border-[#BFA181]" : ""}
                hover:bg-[#BFA181]/80`}
              onClick={() => setSelectedDate(dateStr)}
            >
              {day}
              {hasMissions && (
                <span className="block w-2 h-2 mx-auto mt-1 rounded-full bg-[#BFA181]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getServiceIcon(serviceName: string) {
  switch (serviceName) {
    case "Cleaning":
      return <MdOutlineCleaningServices className="text-[#BFA181] w-8 h-8" />;
    case "Pet Sitting":
      return <MdOutlinePets className="text-[#BFA181] w-8 h-8" />;
    case "Child Care":
      return <MdChildCare className="text-[#BFA181] w-8 h-8" />;
    case "Cooking":
      return <LuCookingPot className="text-[#BFA181] w-8 h-8" />;
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-[#F5E8D3] flex items-center justify-center text-[#BFA181] font-bold">
          {serviceName?.[0] || "?"}
        </div>
      );
  }
}

// --- Simple Bar Chart for Completed Missions by Service ---
function CompletedMissionsBarChart({
  completedMissions,
}: {
  completedMissions: DocumentData[];
}) {
  // Count by serviceName
  const counts: { [service: string]: number } = {};
  completedMissions.forEach((m) => {
    const name = m.serviceName || "Other";
    counts[name] = (counts[name] || 0) + 1;
  });
  const maxCount = Math.max(1, ...Object.values(counts));
  const services = Object.keys(counts);

  if (services.length === 0) {
    return (
      <div className="text-[#7C5E3C] text-center py-8">
        No completed missions yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {services.map((service) => (
          <div key={service} className="flex items-center gap-2">
            <div className="w-32 flex items-center gap-2">
              {getServiceIcon(service)}
              <span className="text-[#7C5E3C] text-sm">{service}</span>
            </div>
            <div className="flex-1 h-5 bg-[#F5E8D3] rounded">
              <div
                className="h-5 bg-[#BFA181] rounded"
                style={{
                  width: `${(counts[service] / maxCount) * 100}%`,
                  minWidth: "2rem",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <span className="ml-2 text-[#7C5E3C] font-semibold">
              {counts[service]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- End Bar Chart ---

// --- Helper to format subservices for email ---
function formatSubservices(subservices?: Record<string, number>) {
  if (!subservices || Object.keys(subservices).length === 0) return "None";
  return Object.entries(subservices)
    .map(([name, hours]) => `${name} (${hours}h)`)
    .join(", ");
}

// New helper to format atLocation for emails and UI
function formatAtLocation(atLocation: string | undefined | null) {
  if (!atLocation) return "";
  if (atLocation === "customer") return "At Customer's Address";
  if (atLocation === "provider") return "At your place";
  return atLocation;
}

export default function DashboardProviderPage() {
  const [missions, setMissions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Modal state for confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [missionToAccept, setMissionToAccept] = useState<DocumentData | null>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  });

  // Completed missions state
  const [completedMissions, setCompletedMissions] = useState<DocumentData[]>(
    []
  );
  const [completedLoading, setCompletedLoading] = useState(true);

  // Fetch missions: both pending (status: "pending", providerId: current user) and assigned (status: "assigned", providerId: current user)
  useEffect(() => {
    const auth = getAuth();

    const fetchMissions = async (user: User) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // Fetch both pending and assigned missions for this provider
        const missionsSnapshot = await getDocs(
          query(
            collection(db, "missions"),
            where("providerId", "==", user.uid),
            where("status", "in", ["pending", "assigned"])
          )
        );
        const missionsData = missionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMissions(missionsData);
        setUserId(user.uid);
      } catch (error) {
        console.error("Failed to fetch missions.", error);
        setErrorMsg("Failed to fetch missions.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCompletedMissions = async (user: User) => {
      setCompletedLoading(true);
      try {
        const completedSnapshot = await getDocs(
          query(
            collection(db, "missions"),
            where("providerId", "==", user.uid),
            where("status", "==", "completed")
          )
        );
        const completedData = completedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedMissions(completedData);
      } catch (error) {
        console.error("Failed to fetch completed missions.", error);
        setErrorMsg("Failed to fetch completed missions.");
      } finally {
        setCompletedLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMissions(user);
        fetchCompletedMissions(user);
      } else {
        setMissions([]);
        setCompletedMissions([]);
        setUserId(null);
        setLoading(false);
        setCompletedLoading(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Accept a mission: set status to "assigned"
  const acceptMission = async (mission: DocumentData) => {
    setAccepting(mission.id);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      if (!userId) {
        throw new Error("User ID is null");
      }
      const missionRef = doc(db, "missions", mission.id);
      const providerRef = doc(db, "users", userId);

      // Update mission status
      await updateDoc(missionRef, {
        status: "assigned",
        providerId: userId,
      });

      // Update provider bookedTimes
      if (mission.times?.length) {
        const bookedSlots = {
          date: mission.date,
          times: mission.times,
        };

        await updateDoc(providerRef, {
          bookedTimes: arrayUnion(bookedSlots),
        });
      }

      // --- Send emails to customer and provider ---

      // Fetch provider info
      let providerData: Record<string, unknown> = {};
      try {
        const providerSnap = await getDoc(providerRef);
        if (providerSnap.exists()) {
          providerData = providerSnap.data() as Record<string, unknown>;
        }
      } catch {
        // If provider info can't be fetched, fallback to mission fields
        providerData = {};
      }

      // Prepare email details
      const customerEmail = mission.customerEmail || mission.userEmail;
      const providerEmail = providerData.email || mission.providerEmail;
      const providerName = providerData.displayName || mission.providerName || "Your Provider";
      const customerName = mission.userName || "Customer";
      const serviceName = mission.serviceName || "Service";
      const date = mission.date || "";
      const times = Array.isArray(mission.times)
        ? mission.times.join(", ")
        : mission.time || mission.times || "";
      const address = mission.userAddress || "";
      const phone = mission.userPhone || "";
      const notes = mission.notes || "";
      const subservices = mission.subservices;
      const price = typeof mission.price === "number"
        ? mission.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : mission.price || "";
      const atLocation = mission.atLocation || "";

      // Email to customer
      if (customerEmail) {
        const customerEmailText = `
Hi ${customerName},

Good news! Your provider (${providerName}) has accepted your mission request.

📝 Service:        ${serviceName}
📅 Date:           ${date}
⏰ Time(s):        ${times || "N/A"}
💼 Subservices:    ${formatSubservices(subservices)}
${atLocation ? `📍 Location:       ${formatAtLocation(atLocation)}` : ""}
💰 Price:          ${price ? price + " NOK" : "N/A"}

👨‍🔧 Provider:      ${providerName}
──────────────────────────────

What happens next?
- Your provider will be in touch if there are any questions.
- If you need to make changes, please contact your provider directly.

If you have any questions, reply to this email or contact our support.

Thank you for choosing us!

Best regards,
The Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: customerEmail,
            subject: `Your Mission is Confirmed: ${serviceName} on ${date}`,
            text: customerEmailText,
          }),
        });
      }

      // Email to provider
      if (providerEmail) {
        const providerEmailText = `
Hi ${providerName},

You have accepted a new mission!

📝 Service:        ${serviceName}
📅 Date:           ${date}
⏰ Time(s):        ${times || "N/A"}
💼 Subservices:    ${formatSubservices(subservices)}
${atLocation ? `📍 Location:       ${formatAtLocation(atLocation)}` : ""}
💰 Price:          ${price ? price + " NOK" : "N/A"}

👤 Customer:       ${customerName}
📍 Address:        ${address}
📞 Phone:          ${phone}
✉️ Email:          ${customerEmail || "N/A"}
${notes ? `📝 Notes:          ${notes}` : ""}

Please make sure to contact the customer if needed and prepare for the mission.

Best regards,
The Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: providerEmail,
            subject: `Mission Accepted: ${serviceName} for ${customerName} on ${date}`,
            text: providerEmailText,
          }),
        });
      }

      // Update local state
      setMissions((prev) =>
        prev.map((m) =>
          m.id === mission.id ? { ...m, status: "assigned" } : m
        )
      );
      setSuccessMsg("Mission accepted successfully!");
    } catch (error) {
      console.error("Failed to accept mission.", error);
      setErrorMsg("Failed to accept mission.");
    } finally {
      setAccepting(null);
      setConfirmOpen(false);
      setMissionToAccept(null);
    }
  };

  // Group missions by date (yyyy-mm-dd)
  const missionsByDate = useMemo(() => {
    const map: { [date: string]: DocumentData[] } = {};
    missions.forEach((mission) => {
      if (mission.date) {
        map[mission.date] = map[mission.date] || [];
        map[mission.date].push(mission);
      }
    });
    return map;
  }, [missions]);

  // Missions for selected date
  const missionsForSelectedDate = missionsByDate[selectedDate] || [];

  // Stats
  const totalMissions = missions.length;
  const upcomingMissions = missions.filter((m) => {
    const missionDate = new Date(m.date + "T" + (m.time || "00:00"));
    return missionDate >= new Date();
  }).length;

  // Completed stats and earnings
  const completedCount = completedMissions.length;
  const totalEarnings = completedMissions.reduce(
    (sum, m) => sum + (typeof m.price === "number" ? m.price : 0),
    0
  );

  // Helper: is provider already assigned for this date/time?
  const isProviderAssignedFor = (date: string, time: string) => {
    return missions.some(
      (m) =>
        m.status === "assigned" &&
        m.date === date &&
        m.time === time &&
        m.providerId === userId
    );
  };

  // --- Mission Card UI Helper ---

  interface MissionCardProps {
    mission: DocumentData;
    isPending: boolean;
    isAssigned: boolean;
    alreadyAssignedForSlot: boolean;
  }

  function MissionCard({ mission, isPending, isAssigned, alreadyAssignedForSlot }: MissionCardProps) {
    // Format time and date
    const dateObj = mission.date ? new Date(mission.date) : null;
    const dateStr = dateObj
      ? dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      : mission.date || "N/A";
    const timeStr = mission.time || (Array.isArray(mission.times) ? mission.times.join(", ") : mission.times) || "N/A";
    const duration = Array.isArray(mission.times) ? mission.times.length : mission.times || "N/A";
    const price = typeof mission.price === "number" ? mission.price : null;
    const atLocation = mission.atLocation || "";

    return (
      <div
        key={mission.id}
        className="p-5 border border-gray-200 rounded-2xl bg-gradient-to-br from-[#F9F5EF] to-[#F5E8D3] shadow-sm hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-start gap-6"
      >
        <div className="bg-[#F5E8D3] rounded-full p-4 flex-shrink-0 flex items-center justify-center shadow">
          {getServiceIcon(mission.serviceName)}
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
            <h3 className="font-bold text-xl text-[#7C5E3C] flex items-center gap-2">
              {mission.serviceName}
              {isPending && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                  Pending
                </span>
              )}
              {isAssigned && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                  Assigned
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-[#BFA181] text-sm font-medium">
              <FiClock className="inline-block mr-1" />
              {dateStr} &middot; {timeStr}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#7C5E3C] mb-2">
            <div className="flex items-center gap-2">
              <FiUser className="text-[#BFA181]" />
              <span className="font-medium">Customer:</span>
              <span>{mission.userName || mission.userId || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-[#BFA181]" />
              <span className="font-medium">Phone:</span>
              <span>{mission.userPhone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-[#BFA181]" />
              <span className="font-medium">Address:</span>
              <span>{mission.userAddress || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-[#BFA181]" />
              <span className="font-medium">Email:</span>
              <span>{mission.customerEmail || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-[#BFA181]" />
              <span className="font-medium">Duration:</span>
              <span>
                {duration} {typeof duration === "number" ? (duration === 1 ? "hour" : "hours") : ""}
              </span>
            </div>
            {price !== null && (
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-[#BFA181]" />
                <span className="font-medium">Price:</span>
                <span>
                  NOK {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {atLocation && (
              <div className="flex items-center gap-2">
                {atLocation === "customer" ? (
                  <FiHome className="text-[#BFA181]" />
                ) : atLocation === "provider" ? (
                  <FiMap className="text-[#BFA181]" />
                ) : (
                  <FiMapPin className="text-[#BFA181]" />
                )}
                <span className="font-medium">Location:</span>
                <span>{formatAtLocation(atLocation)}</span>
              </div>
            )}
          </div>
          {mission.notes && (
            <div className="flex items-center gap-2 text-sm text-[#7C5E3C] mb-2">
              <FiFileText className="text-[#BFA181]" />
              <span className="font-medium">Notes:</span>
              <span className="italic">{mission.notes}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {isPending ? (
              <button
                onClick={() => {
                  setMissionToAccept(mission);
                  setConfirmOpen(true);
                }}
                className={`px-5 py-2 rounded-full font-semibold transition text-base shadow ${
                  accepting === mission.id || alreadyAssignedForSlot
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
                }`}
                disabled={accepting === mission.id || alreadyAssignedForSlot}
              >
                {accepting === mission.id
                  ? "Accepting..."
                  : alreadyAssignedForSlot
                  ? "Unavailable"
                  : "Accept Mission"}
              </button>
            ) : isAssigned ? (
              mission.customerEmail && (
                <a
                  href={`mailto:${mission.customerEmail}`}
                  className="px-5 py-2 rounded-full font-semibold bg-white border border-[#BFA181] text-[#BFA181] hover:bg-[#F5E8D3] transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Customer
                </a>
              )
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5EF] to-[#F5E8D3] flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setMissionToAccept(null);
        }}
        onConfirm={() => {
          if (missionToAccept) acceptMission(missionToAccept);
        }}
        mission={missionToAccept}
      />
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#BFA181] rounded-full p-3 shadow-md">
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
                  d="M12 6v6l4 2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#7C5E3C]">
                Provider Dashboard
              </h1>
              <p className="text-[#7C5E3C] text-sm sm:text-base">
                Manage your missions seamlessly.
              </p>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                value: totalMissions,
                label: "Total Missions",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              },
              {
                value: upcomingMissions,
                label: "Upcoming",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                value: completedLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-[#BFA181]"
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
                ) : (
                  completedCount
                ),
                label: "Completed",
                icon: "M5 13l4 4L19 7",
              },
              {
                value: completedLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-[#BFA181]"
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
                ) : (
                  `${totalEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}NOK`
                ),
                label: "Earnings",
                icon: "M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-[#F5E8D3] rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <svg
                  className="w-6 h-6 text-[#4A7C59]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={stat.icon}
                  />
                </svg>
                <div>
                  <span className="text-[#BFA181] font-bold text-lg">
                    {stat.value}
                  </span>
                  <p className="text-xs text-[#7C5E3C]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success/Error Messages */}
        {(successMsg || errorMsg) && (
          <div className="space-y-4">
            {successMsg && (
              <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#4A7C59]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Mission Calendar
            </h2>
            <Calendar
              missionsByDate={missionsByDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          {/* Missions for Selected Date */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#4A7C59]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Missions on {selectedDate}
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <svg
                  className="animate-spin h-8 w-8 text-[#BFA181] mr-2"
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
                <span className="text-[#7C5E3C] text-lg">Loading...</span>
              </div>
            ) : missionsForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <svg
                  className="w-12 h-12 mb-2 text-[#BFA181]"
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
                <span className="text-[#7C5E3C] text-lg">
                  No missions for this date.
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {missionsForSelectedDate
                  .sort((a, b) => {
                    const timeA = typeof a.time === "string" ? a.time : "";
                    const timeB = typeof b.time === "string" ? b.time : "";
                    return timeA.localeCompare(timeB);
                  })
                  .map((mission) => {
                    const isPending = mission.status === "pending";
                    const isAssigned = mission.status === "assigned";
                    const alreadyAssignedForSlot =
                      isProviderAssignedFor(mission.date, mission.time) &&
                      !isAssigned;
                    return (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        isPending={isPending}
                        isAssigned={isAssigned}
                        alreadyAssignedForSlot={alreadyAssignedForSlot}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Completed Missions Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#4A7C59]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            Completed Missions Overview
          </h2>
          {completedLoading ? (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-[#BFA181] mr-2"
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
              <span className="text-[#7C5E3C] text-lg">Loading...</span>
            </div>
          ) : (
            <>
              <CompletedMissionsBarChart
                completedMissions={completedMissions}
              />
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-[#7C5E3C] text-lg font-semibold">
                  Total Completed:{" "}
                  <span className="text-[#BFA181]">{completedCount}</span>
                </div>
                <div className="text-[#7C5E3C] text-lg font-semibold">
                  Total Earnings:{" "}
                  <span className="text-[#BFA181]">
                    NOK
                    {totalEarnings.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
