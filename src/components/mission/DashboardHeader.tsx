"use client";

import { DashboardStats } from "@/services/mission/missionStatsService";

type DashboardHeaderProps = {
  stats: DashboardStats;
  completedLoading: boolean;
};

export function DashboardHeader({ stats, completedLoading }: DashboardHeaderProps) {
  const LoadingSpinner = () => (
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
  );

  return (
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            value: stats.totalMissions,
            label: "Total Missions",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
          },
          {
            value: stats.upcomingMissions,
            label: "Upcoming",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            value: completedLoading ? <LoadingSpinner /> : stats.completedCount,
            label: "Completed",
            icon: "M5 13l4 4L19 7",
          },
          {
            value: completedLoading ? (
              <LoadingSpinner />
            ) : (
              `${stats.totalEarnings.toLocaleString(undefined, {
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
  );
}

