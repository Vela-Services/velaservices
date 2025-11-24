import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchProviderMissions, fetchCompletedMissions, Mission } from "@/services/mission/missionService";

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const fetchMissions = async (user: User) => {
      setLoading(true);
      setError(null);
      try {
        const missionsData = await fetchProviderMissions(user.uid);
        setMissions(missionsData);
        setUserId(user.uid);
      } catch (error) {
        console.error("Failed to fetch missions.", error);
        setError("Failed to fetch missions.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCompleted = async (user: User) => {
      setCompletedLoading(true);
      try {
        const completedData = await fetchCompletedMissions(user.uid);
        setCompletedMissions(completedData);
      } catch (error) {
        console.error("Failed to fetch completed missions.", error);
        setError("Failed to fetch completed missions.");
      } finally {
        setCompletedLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMissions(user);
        fetchCompleted(user);
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

  return {
    missions,
    completedMissions,
    loading,
    completedLoading,
    error,
    userId,
    setMissions,
  };
}

