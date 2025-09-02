"use client";

import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signOut,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { UserProfile } from "../../types/types";

import { IoSettingsSharp } from "react-icons/io5";

const PROFILE_PIC_PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Ensure auth persistence is set and handle auth state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Try to set persistence to local (default for most apps)
    setPersistence(auth, browserLocalPersistence)
      .catch(() => {
        // fallback to session if local fails
        return setPersistence(auth, browserSessionPersistence);
      })
      .finally(() => {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
            // Fetch user profile from Firestore
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              if (userDoc.exists()) {
                setProfile(userDoc.data() as UserProfile);
              } else {
                setProfile(null);
              }
            } catch {
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Helper to clear all local/session storage and cookies for true disconnect
  const clearAllAuthData = () => {
    try {
      // Remove Firebase tokens from localStorage/sessionStorage
      localStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":" + auth.name);
      localStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":DEFAULT");
      localStorage.removeItem("firebase:redirectEvent:" + auth.app.options.apiKey + ":DEFAULT");
      sessionStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":" + auth.name);
      sessionStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":DEFAULT");
      sessionStorage.removeItem("firebase:redirectEvent:" + auth.app.options.apiKey + ":DEFAULT");
      // Remove all local/session storage keys that start with "firebase:"
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("firebase:")) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("firebase:")) sessionStorage.removeItem(key);
      });
      // Remove cookies (if any) related to Firebase Auth
      if (typeof document !== "undefined") {
        document.cookie
          .split(";")
          .forEach((c) => {
            if (c.trim().startsWith("__session") || c.trim().startsWith("firebase")) {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            }
          });
      }
    } catch {
      // ignore errors
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      // Sign out from Firebase Auth
      await signOut(auth);

      // Clear all local/session storage and cookies related to Firebase Auth
      clearAllAuthData();

      // Optionally, reload the page to ensure all state is reset
      // router.push("/login") may not be enough if there are lingering tokens
      window.location.href = "/login";
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
      setSigningOut(false);
    }
  };

  const handleEdit = () => {
    setEditData({
      displayName: profile?.displayName || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
    setEditing(true);
    setError(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: editData.displayName || "",
        phone: editData.phone || "",
        address: editData.address || "",
      });
      // Refresh profile
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
      setEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <div className="text-[#7C5E3C] text-lg">Loading profile...</div>
      </div>
    );
  }

  // Remove debug logs for production
  // console.log(profile);
  // console.log(user);

  if (!user) {
    // If not authenticated, redirect to login after a short delay (for extra safety)
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#7C5E3C] mb-4">
            Not signed in
          </h2>
          <p className="text-[#7C5E3C] mb-4">
            Please log in to view your profile.
          </p>
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

  // Settings modal (for password, notification, etc.)
  const SettingsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-[#BFA181] hover:text-[#7C5E3C] text-2xl"
          onClick={() => setShowSettings(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-[#7C5E3C]">
          Account Settings
        </h3>
        <ul className="space-y-4">
          <li>
            <span className="block text-sm font-medium text-[#7C5E3C] mb-1">
              Change Password
            </span>
            <a
              href="profile/password"
              className="text-[#BFA181] hover:underline"
            >
              Reset your password
            </a>
          </li>
          {/* <li>
            <span className="block text-sm font-medium text-[#7C5E3C] mb-1">
              Notifications
            </span>
            <a
              href="/settings/notifications"
              className="text-[#BFA181] hover:underline"
            >
              Manage notification preferences
            </a>
          </li> */}
          <li>
            <span className="block text-sm font-medium text-[#7C5E3C] mb-1">
              Privacy
            </span>
            <a
              href="/privacy"
              className="text-[#BFA181] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Privacy Policy
            </a>
          </li>
          <li>
            <span className="block text-sm font-medium text-[#7C5E3C] mb-1">
              Delete Account
            </span>
            <a
              href="/contact"
              className="text-[#BFA181] hover:underline"
            >
              Contact support to delete your account
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      {showSettings && <SettingsModal />}
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg relative">
        {/* Settings button */}
        <button
          className="absolute top-4 right-4 text-[#BFA181] hover:text-[#7C5E3C] text-2xl"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
          title="Account Settings"
        >
          <IoSettingsSharp />
        </button>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-[#F5E8D3] border-4 border-[#BFA181]/30 shadow-lg flex items-center justify-center overflow-hidden mb-2">
              <img
                src={user.photoURL || PROFILE_PIC_PLACEHOLDER}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="text-xs text-[#BFA181] hover:text-[#7C5E3C] underline"
              disabled
              title="Profile picture upload coming soon"
            >
              Change Photo
            </button>
          </div>
          {/* Profile Info */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-2 text-[#7C5E3C] flex items-center gap-2">
              {profile?.displayName || "Your Name"}
              <span className="text-xs bg-[#F5E8D3] text-[#BFA181] px-2 py-0.5 rounded-full ml-2">
                {profile?.role
                  ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                  : "User"}
              </span>
            </h2>
            <p className="text-[#7C5E3C] mb-1">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {profile?.phone && (
              <p className="text-[#7C5E3C] mb-1">
                <span className="font-medium">Phone:</span> {profile.phone}
              </p>
            )}
            {profile?.address && (
              <p className="text-[#7C5E3C] mb-1">
                <span className="font-medium">Address:</span> {profile.address}
              </p>
            )}
            <p className="text-[#7C5E3C] mb-1">
              <span className="font-medium">Account Created:</span>{" "}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : "N/A"}
            </p>

            {/* Edit Profile Button */}
            <button
              onClick={handleEdit}
              className="mt-4 px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Editable Form */}
        {editing && (
          <form
            className="mt-8 border-t pt-6 space-y-4"
            onSubmit={handleEditSave}
          >
            <h3 className="text-lg font-bold text-[#7C5E3C] mb-2">
              Edit Profile
            </h3>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-[#7C5E3C] mb-1">
                Name
              </label>
              <input
                type="text"
                name="displayName"
                className="w-full border rounded-md px-3 py-2 text-[#7C5E3C]"
                value={editData.displayName || ""}
                onChange={handleEditChange}
                placeholder="Your Name"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7C5E3C] mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full border rounded-md px-3 py-2 text-[#7C5E3C]"
                value={editData.phone || ""}
                onChange={handleEditChange}
                placeholder="Your phone number"
                autoComplete="tel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7C5E3C] mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="w-full border rounded-md px-3 py-2 text-[#7C5E3C]"
                value={editData.address || ""}
                onChange={handleEditChange}
                placeholder="Your address"
                autoComplete="street-address"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-gray-200 text-[#7C5E3C] font-semibold hover:bg-gray-300 transition"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* Divider */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row gap-6 items-center">
          {/* Placeholder for future: badges, stats, etc. */}
          <div className="flex-1 w-full">
            <h4 className="text-lg font-bold text-[#7C5E3C] mb-2">
              Account Info
            </h4>
            <ul className="text-[#7C5E3C] text-sm space-y-1">
              <li>
                <span className="font-medium">User ID:</span> {user.uid}
              </li>
              <li>
                <span className="font-medium">Email Verified:</span>{" "}
                {user.emailVerified ? "Yes" : "No"}
              </li>
              {/* <li>
                <span className="font-medium">Provider:</span>{" "}
                {user.providerData[0]?.providerId || "N/A"}
              </li> */}
              <li>
                <span className="font-medium">Last Sign-in:</span>{" "}
                {user.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleString()
                  : "N/A"}
              </li>
              <li>
                <span className="font-medium">Creation Time:</span>{" "}
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleString()
                  : "N/A"}
              </li>
            </ul>
          </div>
          {/* Placeholder for future: user stats, badges, etc. */}
          <div className="flex-1 w-full">
            <h4 className="text-lg font-bold text-[#7C5E3C] mb-2">
              Profile Status
            </h4>
            <ul className="text-[#7C5E3C] text-sm space-y-1">
              <li>
                <span className="font-medium">Profile Completion:</span>{" "}
                <span>
                  {[
                    user.displayName,
                    user.email,
                    profile?.phone,
                    profile?.address,
                  ].filter(Boolean).length >= 5
                    ? "100%"
                    : "Incomplete"}
                </span>
              </li>
              <li>
                <span className="font-medium">Photo:</span>{" "}
                {user.photoURL ? "Set" : "Not set"}
              </li>
              <li>
                <span className="font-medium">Role:</span>{" "}
                {profile?.role
                  ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                  : "N/A"}
              </li>
              <li>
                <span className="font-medium">Notifications:</span> Coming soon
              </li>
            </ul>
          </div>
        </div>
        {/* Sign Out Button */}
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
