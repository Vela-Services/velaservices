"use client";

import { useState } from "react";
import { useMissions } from "@/app/hooks/mission/useMissions";
import { useMissionAcceptance } from "@/app/hooks/mission/useMissionAcceptance";
import { useDashboardStats } from "@/app/hooks/mission/useDashboardStats";
import { ConfirmModal } from "@/components/mission/ConfirmModal";
import { MissionCalendar } from "@/components/mission/MissionCalendar";
import { MissionCard } from "@/components/mission/MissionCard";
import { CompletedMissionsChart } from "@/components/mission/CompletedMissionsChart";
import { DashboardHeader } from "@/components/mission/DashboardHeader";
import { Mission } from "@/services/mission/missionService";

export default function DashboardProviderPage() {
  const { missions, completedMissions, loading, completedLoading, userId, setMissions } = useMissions();
  const { accepting, error: acceptError, success: acceptSuccess, handleAcceptMission } = useMissionAcceptance(userId);
  const { stats, missionsByDate } = useDashboardStats(missions, completedMissions);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [missionToAccept, setMissionToAccept] = useState<Mission | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  const missionsForSelectedDate = missionsByDate[selectedDate] || [];

  const isProviderAssignedFor = (date: string, time: string) => {
    return missions.some(
      (m) =>
        m.status === "assigned" &&
        m.date === date &&
        m.time === time &&
        m.providerId === userId
    );
  };

  const handleConfirmAccept = async () => {
    if (!missionToAccept) return;
    
    const result = await handleAcceptMission(missionToAccept);
    
    if (result.success) {
      // Update local state
      setMissions((prev) =>
        prev.map((m) =>
          m.id === missionToAccept.id ? { ...m, status: "assigned" } : m
        )
      );
    }
    
    setConfirmOpen(false);
    setMissionToAccept(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5EF] to-[#F5E8D3] flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setMissionToAccept(null);
        }}
        onConfirm={handleConfirmAccept}
      />
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Important Pricing Notice */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900 mb-1">
                Important: Pricing Information
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                The price you set for your services should <strong>include the 10% platform fee</strong>. 
                This means Véla will deduct 10% from the price you set. For example, if you set 100 NOK/hour, 
                you will receive 90 NOK/hour, and 10 NOK/hour goes to Véla.
              </p>
            </div>
          </div>
        </div>

        <DashboardHeader stats={stats} completedLoading={completedLoading} />

        {(acceptSuccess || acceptError) && (
          <div className="space-y-4">
            {acceptSuccess && (
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
                {acceptSuccess}
              </div>
            )}
            {acceptError && (
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
                {acceptError}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <MissionCalendar
              missionsByDate={missionsByDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

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
                        accepting={accepting}
                        onAccept={() => {
                          setMissionToAccept(mission as Mission);
                          setConfirmOpen(true);
                        }}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>

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
              <CompletedMissionsChart completedMissions={completedMissions} />
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-[#7C5E3C] text-lg font-semibold">
                  Total Completed:{" "}
                  <span className="text-[#BFA181]">{stats.completedCount}</span>
                </div>
                <div className="text-[#7C5E3C] text-lg font-semibold">
                  Total Earnings:{" "}
                  <span className="text-[#BFA181]">
                    NOK
                    {stats.totalEarnings.toLocaleString(undefined, {
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
