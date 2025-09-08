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
} from "firebase/firestore";
import {
  MdOutlineCleaningServices,
  MdOutlinePets,
  MdChildCare,
} from "react-icons/md";
import { LuCookingPot } from "react-icons/lu";

// Simple calendar grid for the month
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
  // [Calendar code omitted for brevity, unchanged from original]
  // ... (unchanged)
  // (Keep the Calendar function as in the original)
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

// --- New: Simple Bar Chart for Completed Missions by Service ---
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

export default function DashboardProviderPage() {
  const [missions, setMissions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [marking, setMarking] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  });

  // --- New: Completed missions state ---
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
    }
  };
  

  const markMissionDone = async (missionId: string) => {
    setMarking(missionId);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const missionRef = doc(db, "missions", missionId);
      await updateDoc(missionRef, {
        status: "completed",
      });
      setMissions((prev) => prev.filter((m) => m.id !== missionId));
      // After marking as completed, refetch completed missions
      if (userId) {
        setCompletedLoading(true);
        const completedSnapshot = await getDocs(
          query(
            collection(db, "missions"),
            where("providerId", "==", userId),
            where("status", "==", "completed")
          )
        );
        const completedData = completedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedMissions(completedData);
        setCompletedLoading(false);
      }
      setSuccessMsg("Mission marked as completed!");
    } catch (error) {
      console.error("Failed to mark mission as completed.", error);
      setErrorMsg("Failed to mark mission as completed.");
    } finally {
      setMarking(null);
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

  // --- New: Completed stats and earnings ---
  const completedCount = completedMissions.length;
  // Assume each mission has a "price" field (number), otherwise 0
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5EF] to-[#F5E8D3] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-5xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#BFA181] rounded-full p-4 shadow-lg">
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
              <h1 className="text-3xl font-bold text-[#7C5E3C] mb-1">
                Provider Dashboard
              </h1>
              <p className="text-[#7C5E3C] text-lg">
                Welcome! Here is your mission overview.
              </p>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center">
              <span className="text-[#BFA181] font-bold text-xl">
                {totalMissions}
              </span>
              <span className="text-xs text-[#7C5E3C]">Total Missions</span>
            </div>
            <div className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center">
              <span className="text-[#BFA181] font-bold text-xl">
                {upcomingMissions}
              </span>
              <span className="text-xs text-[#7C5E3C]">Upcoming</span>
            </div>
            {/* New: Completed Missions */}
            <div className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center">
              <span className="text-[#BFA181] font-bold text-xl">
                {completedLoading ? (
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
                )}
              </span>
              <span className="text-xs text-[#7C5E3C]">Completed</span>
            </div>
            {/* New: Earnings */}
            <div className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center">
              <span className="text-[#BFA181] font-bold text-xl">
                {completedLoading ? (
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
                  <>
                    $
                    {totalEarnings.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </>
                )}
              </span>
              <span className="text-xs text-[#7C5E3C]">Earnings</span>
            </div>
          </div>
        </div>

        {/* New: Completed Missions Graphics */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#BFA181]"
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
              <CompletedMissionsBarChart
                completedMissions={completedMissions}
              />
            )}
            {/* Earnings summary */}
            {!completedLoading && (
              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-[#7C5E3C] text-lg font-semibold">
                  Total Completed:{" "}
                  <span className="text-[#BFA181]">{completedCount}</span>
                </div>
                <div className="text-[#7C5E3C] text-lg font-semibold">
                  Total Earnings:{" "}
                  <span className="text-[#BFA181]">
                    $
                    {totalEarnings.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* End New: Completed Missions Graphics */}

        {/* Success/Error messages */}
        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
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
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 text-red-800 border border-red-300 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
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

        {/* Main dashboard content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Calendar */}
          <div className="md:w-1/2">
            <Calendar
              missionsByDate={missionsByDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          {/* Missions for selected date */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow p-4 min-h-[350px]">
              <h2 className="text-xl font-semibold text-[#7C5E3C] mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-[#BFA181]"
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
                      // If mission is pending, show accept button (if not already assigned for this date/time)
                      const isPending = mission.status === "pending";
                      const isAssigned = mission.status === "assigned";
                      const alreadyAssignedForSlot =
                        isProviderAssignedFor(mission.date, mission.time) &&
                        !isAssigned;
                      return (
                        <div
                          key={mission.id}
                          className="p-4 border rounded-xl bg-[#F9F5EF] shadow flex flex-col md:flex-row items-center md:items-start"
                        >
                          <div className="bg-[#F5E8D3] rounded-full p-3 mr-0 md:mr-4 mb-3 md:mb-0 flex-shrink-0">
                            {getServiceIcon(mission.serviceName)}
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h3 className="font-semibold text-lg text-[#7C5E3C] mb-1">
                                {mission.serviceName}
                              </h3>
                              <div className="text-sm text-[#BFA181] mb-1 md:mb-0">
                                {mission.time}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Name:</span>{" "}
                              <span>
                                {mission.userName
                                  ? mission.userName
                                  : mission.userId
                                  ? mission.userId
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Phone number:</span>{" "}
                              {mission.userPhone}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">
                                Time(s): {mission.times}h
                              </span>
                            </div>

                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Address:</span>{" "}
                              {mission.userAddress}
                            </div>

                            {mission.notes && (
                              <div className="text-sm text-gray-400 mb-1">
                                <span className="font-medium">Notes:</span>{" "}
                                {mission.notes}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-3 mt-2">
                              {isPending ? (
                                <button
                                  onClick={() => acceptMission(mission)}
                                  className={`px-4 py-1.5 rounded-full font-semibold transition ${
                                    accepting === mission.id ||
                                    alreadyAssignedForSlot
                                      ? "bg-[#A68A64] text-white opacity-70 cursor-not-allowed"
                                      : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
                                  }`}
                                  disabled={
                                    accepting === mission.id ||
                                    alreadyAssignedForSlot
                                  }
                                >
                                  {accepting === mission.id
                                    ? "Accepting..."
                                    : alreadyAssignedForSlot
                                    ? "Unavailable"
                                    : "Accept"}
                                </button>
                              ) : isAssigned ? (
                                <>
                                  <button
                                    onClick={() => markMissionDone(mission.id)}
                                    className={`px-4 py-1.5 rounded-full font-semibold transition ${
                                      marking === mission.id
                                        ? "bg-[#A68A64] text-white opacity-70 cursor-not-allowed"
                                        : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
                                    }`}
                                    disabled={marking === mission.id}
                                  >
                                    {marking === mission.id
                                      ? "Marking..."
                                      : "Mark as Done"}
                                  </button>
                                  {mission.customerEmail && (
                                    <a
                                      href={`mailto:${mission.customerEmail}`}
                                      className="px-4 py-1.5 rounded-full font-semibold bg-white border border-[#BFA181] text-[#BFA181] hover:bg-[#F5E8D3] transition"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Contact Customer
                                    </a>
                                  )}
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
