"use client";

import { DocumentData } from "firebase/firestore";
import { FiPhone, FiMapPin, FiUser, FiMail, FiFileText, FiClock, FiDollarSign, FiHome, FiMap } from "react-icons/fi";
import { getServiceIcon } from "@/utils/mission/getServiceIcon";
import { formatAtLocation } from "@/utils/mission/formatAtLocation";

type MissionCardProps = {
  mission: DocumentData;
  isPending: boolean;
  isAssigned: boolean;
  alreadyAssignedForSlot: boolean;
  accepting: string | null;
  onAccept: () => void;
};

export function MissionCard({
  mission,
  isPending,
  isAssigned,
  alreadyAssignedForSlot,
  accepting,
  onAccept,
}: MissionCardProps) {
  const dateObj = mission.date ? new Date(mission.date) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : mission.date || "N/A";
  const timeStr = mission.time || (Array.isArray(mission.times) ? mission.times.join(", ") : mission.times) || "N/A";
  const duration = Array.isArray(mission.times) ? mission.times.length : mission.times || "N/A";
  const price = typeof mission.price === "number" ? mission.price : null;
  const atLocation = mission.atLocation || "";

  return (
    <div className="p-5 border border-gray-200 rounded-2xl bg-gradient-to-br from-[#F9F5EF] to-[#F5E8D3] shadow-sm hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-start gap-6">
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
              onClick={onAccept}
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

