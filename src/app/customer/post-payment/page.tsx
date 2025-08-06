"use client";

import { useEffect, useState } from "react";
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

export default function PostPaymentPage() {
  const [missions, setMissions] = useState<DocumentData[]>([]);
  const [providersByMission, setProvidersByMission] = useState<{
    [missionId: string]: DocumentData[];
  }>({});
  const [assigning, setAssigning] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setLoading(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      if (!user) {
        setMissions([]);
        setProvidersByMission({});
        setLoading(false);
        return;
      }

      try {
        // Step 1: Fetch missions
        const missionsSnapshot = await getDocs(
          query(
            collection(db, "missions"),
            where("userId", "==", user.uid),
            where("status", "==", "pending")
          )
        );
        const missionsData: DocumentData[] = missionsSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as DocumentData[];
        setMissions(missionsData);

        // Step 2: Fetch providers
        const usersSnapshot = await getDocs(
          query(collection(db, "users"), where("role", "==", "provider"))
        );
        const allProviders: DocumentData[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DocumentData[];

        // Step 3: Filter compatible providers
        const result: { [missionId: string]: DocumentData[] } = {};

        for (const mission of missionsData) {
          const missionDate = new Date(`${mission.date}T00:00:00`);
          const weekday = missionDate.toLocaleDateString("en-US", {
            weekday: "long",
          });

          const compatibleProviders = allProviders.filter((provider) => {
            const matchesService = provider.services?.includes(
              mission.serviceName
            );

            const matchesAvailability = provider.availability?.some(
              (slot: { day: string; times: string[] }) =>
                slot.day === weekday && slot.times?.includes(mission.time)
            );

            return matchesService && matchesAvailability;
          });

          result[mission.id] = compatibleProviders;
        }

        setProvidersByMission(result);
      } catch (err) {
        console.error("Failed to load missions or providers.", err);
        setErrorMsg("Failed to load missions or providers.");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  async function assignProviderToMission(
    missionId: string,
    providerId: string
  ) {
    setAssigning(missionId + providerId);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const missionRef = doc(db, "missions", missionId);
      await updateDoc(missionRef, {
        providerId,
        status: "assigned",
      });
      setSuccessMsg("Provider assigned successfully!");
      // Remove the mission from the list
      setMissions((prev) => prev.filter((m) => m.id !== missionId));
    } catch (error) {
      console.error("Error assigning provider.", error);
      setErrorMsg("Error assigning provider. Try again.");
    } finally {
      setAssigning(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5EF] to-[#F5E8D3] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#BFA181] rounded-full p-4 shadow-lg mb-3">
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
          <h1 className="text-3xl font-bold text-[#7C5E3C] mb-2">
            Choose Your Provider
          </h1>
          <p className="text-[#7C5E3C] text-lg text-center">
            Assign a provider to your pending missions below.
          </p>
        </div>

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
        ) : (
          <>
            {successMsg && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
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
                  className="w-5 h-5 mr-2 text-red-500"
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

            {missions.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <svg
                  className="w-16 h-16 mb-4 text-[#BFA181]"
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
                <h2 className="text-2xl font-semibold mb-2 text-[#7C5E3C]">
                  No Pending Missions
                </h2>
                <p className="mb-2 text-[#7C5E3C]">
                  You have no pending missions at the moment.
                </p>
                <a
                  href="/home"
                  className="mt-2 px-6 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
                >
                  Back to Home
                </a>
              </div>
            ) : (
              missions.map((mission) => (
                <div
                  key={mission.id}
                  className="mb-10 p-6 border rounded-2xl bg-white shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#F5E8D3] rounded-full p-3 mr-4">
                      <svg
                        className="w-7 h-7 text-[#BFA181]"
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
                    </div>
                    <div>
                      <h2 className="font-semibold text-xl text-[#7C5E3C]">
                        {mission.serviceName}
                      </h2>
                      <div className="text-sm text-gray-500">
                        {mission.date} at {mission.time}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Select a provider for this mission:
                  </p>

                  {providersByMission[mission.id]?.length > 0 ? (
                    <ul className="space-y-3">
                      {providersByMission[mission.id].map((provider) => (
                        <li
                          key={provider.id}
                          className="p-4 border rounded-xl flex items-center justify-between bg-[#F9F5EF] hover:shadow transition"
                        >
                          <div className="flex items-center">
                            <img
                              src={
                                provider.avatarUrl ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  provider.name || "Provider"
                                )}`
                              }
                              alt={provider.name}
                              className="w-12 h-12 rounded-full object-cover mr-4 border"
                            />
                            <div>
                              <p className="font-medium text-[#7C5E3C]">
                                {provider.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {provider.email}
                              </p>
                              {provider.rating && (
                                <div className="flex items-center mt-1">
                                  <svg
                                    className="w-4 h-4 text-yellow-400 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                  </svg>
                                  <span className="text-xs text-gray-600">
                                    {provider.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              assignProviderToMission(mission.id, provider.id)
                            }
                            className={`px-5 py-2 rounded-full font-semibold transition ${
                              assigning === mission.id + provider.id
                                ? "bg-[#A68A64] text-white opacity-70 cursor-not-allowed"
                                : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
                            }`}
                            disabled={assigning === mission.id + provider.id}
                          >
                            {assigning === mission.id + provider.id
                              ? "Assigning..."
                              : "Assign"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
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
                          d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                        />
                      </svg>
                      No available providers for this mission.
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
