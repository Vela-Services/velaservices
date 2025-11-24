import React from "react";
import { UserProfile } from "@/types/types";
import { 
  IoCalendarOutline, 
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoStarOutline 
} from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";

interface ProfileStatsProps {
  profile: UserProfile | null;
  user: any;
  completion: number;
}

export function ProfileStats({ profile, user, completion }: ProfileStatsProps) {
  const memberSince = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
    : null;

  const stats = [
    {
      label: "Profile Complete",
      value: `${completion}%`,
      icon: IoCheckmarkCircleOutline,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Email Status",
      value: user?.emailVerified ? "Verified" : "Unverified",
      icon: MdOutlineVerified,
      color: user?.emailVerified 
        ? "from-blue-500 to-cyan-500" 
        : "from-yellow-500 to-orange-500",
      bgColor: user?.emailVerified ? "bg-blue-50" : "bg-yellow-50",
      textColor: user?.emailVerified ? "text-blue-700" : "text-yellow-700",
    },
    {
      label: "Member Since",
      value: memberSince || "N/A",
      icon: IoCalendarOutline,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Account Type",
      value: profile?.role 
        ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
        : "User",
      icon: IoStarOutline,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-3 border border-white/50 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Icon 
                className={`${stat.textColor} opacity-80`} 
                size={18} 
              />
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-20`}>
                <Icon className="text-white" size={14} />
              </div>
            </div>
            <div className={`${stat.textColor} font-bold text-base mb-0.5`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 opacity-70">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

