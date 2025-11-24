import { useMemo } from "react";
import { DocumentData } from "firebase/firestore";
import { calculateDashboardStats, groupMissionsByDate } from "@/services/mission/missionStatsService";

export function useDashboardStats(missions: DocumentData[], completedMissions: DocumentData[]) {
  const stats = useMemo(
    () => calculateDashboardStats(missions, completedMissions),
    [missions, completedMissions]
  );

  const missionsByDate = useMemo(
    () => groupMissionsByDate(missions),
    [missions]
  );

  return {
    stats,
    missionsByDate,
  };
}

