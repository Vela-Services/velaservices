"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { UserProfile } from "../../types/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <div className="text-[#7C5E3C] text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#7C5E3C] mb-4">Not signed in</h2>
          <p className="text-[#7C5E3C] mb-4">Please log in to view your profile.</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7C5E3C]">
          My Profile
        </h2>
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-[#7C5E3C]">Email:</span>
            <span className="block text-[#7C5E3C]">{user.email}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-[#7C5E3C]">Role:</span>
            <span className="block text-[#7C5E3C]">
              {profile?.role ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : "N/A"}
            </span>
          </div>
          {profile?.why && (
            <div>
              <span className="block text-sm font-medium text-[#7C5E3C]">Why Vela Services:</span>
              <span className="block text-[#7C5E3C]">{profile.why}</span>
            </div>
          )}
          <div>
            <span className="block text-sm font-medium text-[#7C5E3C]">Account Created:</span>
            <span className="block text-[#7C5E3C]">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-8 w-full bg-[#BFA181] text-white py-2 rounded-md hover:bg-[#A68A64] transition disabled:opacity-60"
          disabled={signingOut}
        >
          {signingOut ? "Disconnecting..." : "Disconnect"}
        </button>
      </div>
    </div>
  );
}
