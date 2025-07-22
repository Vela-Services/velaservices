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
  // Get current month and year from selectedDate
  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : today;
  const year = selected.getFullYear();
  const month = selected.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1);
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);
  // What day of week does the month start on? (0=Sun)
  const startDay = firstDay.getDay();
  // How many days in month?
  const daysInMonth = lastDay.getDate();

  // Build calendar grid
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

  // Helper to format date as yyyy-mm-dd
  function fmt(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[#7C5E3C] text-lg">
          {selected.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        {/* Month navigation */}
        <div className="flex gap-2">
          <button
            className="px-2 py-1 rounded hover:bg-[#F5E8D3]"
            onClick={() => {
              const prevMonth = new Date(year, month - 1, 1);
              setSelectedDate(fmt(prevMonth.getFullYear(), prevMonth.getMonth(), 1));
            }}
            aria-label="Previous month"
          >
            &lt;
          </button>
          <button
            className="px-2 py-1 rounded hover:bg-[#F5E8D3]"
            onClick={() => {
              const nextMonth = new Date(year, month + 1, 1);
              setSelectedDate(fmt(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
            }}
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-[#BFA181] mb-1">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
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
                ${isSelected ? "bg-[#BFA181] text-white" : "bg-[#F9F5EF] text-[#7C5E3C]"}
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

export default function DashboardProviderPage() {
  const [assignedMissions, setAssignedMissions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [marking, setMarking] = useState<string | null>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const auth = getAuth();

    const fetchMissions = async (user: User) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const missionsSnapshot = await getDocs(
          query(
            collection(db, "missions"),
            where("providerId", "==", user.uid),
            where("status", "==", "assigned")
          )
        );
        const missionsData = missionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignedMissions(missionsData);
      } catch (error) {
        console.error("Failed to fetch missions.", error);
        setErrorMsg("Failed to fetch missions.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMissions(user);
      } else {
        setAssignedMissions([]);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const markMissionDone = async (missionId: string) => {
    setMarking(missionId);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const missionRef = doc(db, "missions", missionId);
      await updateDoc(missionRef, {
        status: "completed",
      });
      setAssignedMissions((prev) => prev.filter((m) => m.id !== missionId));
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
    assignedMissions.forEach((mission) => {
      if (mission.date) {
        map[mission.date] = map[mission.date] || [];
        map[mission.date].push(mission);
      }
    });
    return map;
  }, [assignedMissions]);

  // Missions for selected date
  const missionsForSelectedDate = missionsByDate[selectedDate] || [];

  // Stats
  const totalMissions = assignedMissions.length;
 // const completedMissions = 0; // Could be fetched if needed
  const upcomingMissions = assignedMissions.filter((m) => {
    const missionDate = new Date(m.date + "T" + (m.time || "00:00"));
    return missionDate >= new Date();
  }).length;

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
              <span className="text-[#BFA181] font-bold text-xl">{totalMissions}</span>
              <span className="text-xs text-[#7C5E3C]">Total Missions</span>
            </div>
            <div className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center">
              <span className="text-[#BFA181] font-bold text-xl">{upcomingMissions}</span>
              <span className="text-xs text-[#7C5E3C]">Upcoming</span>
            </div>
          </div>
        </div>

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
                <svg className="w-6 h-6 text-[#BFA181]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
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
                  <span className="text-[#7C5E3C] text-lg">No missions for this date.</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {missionsForSelectedDate
                    .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                    .map((mission) => (
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
                          <span className="font-medium">Customer:</span>{" "}
                          <span>
                            {mission.customerName
                              ? mission.customerName
                              : mission.userId
                              ? mission.userId
                              : "N/A"}
                          </span>
                        </div>
                        {mission.address && (
                          <div className="text-sm text-gray-500 mb-1">
                            <span className="font-medium">Address:</span>{" "}
                            {mission.address}
                          </div>
                        )}
                        {mission.notes && (
                          <div className="text-sm text-gray-400 mb-1">
                            <span className="font-medium">Notes:</span>{" "}
                            {mission.notes}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2">
                          <button
                            onClick={() => markMissionDone(mission.id)}
                            className={`px-4 py-1.5 rounded-full font-semibold transition ${
                              marking === mission.id
                                ? "bg-[#A68A64] text-white opacity-70 cursor-not-allowed"
                                : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
                            }`}
                            disabled={marking === mission.id}
                          >
                            {marking === mission.id ? "Marking..." : "Mark as Done"}
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
