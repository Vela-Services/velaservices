import { DocumentData } from "firebase/firestore";

export type DashboardStats = {
  totalMissions: number;
  upcomingMissions: number;
  completedCount: number;
  totalEarnings: number;
};

export function calculateDashboardStats(
  missions: DocumentData[],
  completedMissions: DocumentData[]
): DashboardStats {
  const totalMissions = missions.length;
  
  const upcomingMissions = missions.filter((m) => {
    const missionDate = new Date(m.date + "T" + (m.time || "00:00"));
    return missionDate >= new Date();
  }).length;

  const completedCount = completedMissions.length;
  
  const totalEarnings = completedMissions.reduce(
    (sum, m) => sum + (typeof m.price === "number" ? m.price : 0),
    0
  );

  return {
    totalMissions,
    upcomingMissions,
    completedCount,
    totalEarnings,
  };
}

export function groupMissionsByDate(missions: DocumentData[]): { [date: string]: DocumentData[] } {
  const map: { [date: string]: DocumentData[] } = {};
  missions.forEach((mission) => {
    if (mission.date) {
      map[mission.date] = map[mission.date] || [];
      map[mission.date].push(mission);
    }
  });
  return map;
}

