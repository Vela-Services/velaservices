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

// Color palette for improved style and accessibility
const COLORS = {
  background: "#F8F6F2",
  card: "#FFFDF8",
  accent: "#BFA181",
  accentDark: "#A68A64",
  accentLight: "#E8D8C3",
  text: "#3E2C18",
  textSecondary: "#7C5E3C",
  border: "#E5D3B3",
  error: "#E57373",
  success: "#4CAF50",
  inputBg: "#F5E8D3",
  inputBorder: "#BFA181",
  shadow: "0 4px 24px 0 rgba(191,161,129,0.10)",
};

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

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setPersistence(auth, browserLocalPersistence)
      .catch(() => setPersistence(auth, browserSessionPersistence))
      .finally(() => {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
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

  const clearAllAuthData = () => {
    try {
      localStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":" + auth.name);
      localStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":DEFAULT");
      localStorage.removeItem("firebase:redirectEvent:" + auth.app.options.apiKey + ":DEFAULT");
      sessionStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":" + auth.name);
      sessionStorage.removeItem("firebase:authUser:" + auth.app.options.apiKey + ":DEFAULT");
      sessionStorage.removeItem("firebase:redirectEvent:" + auth.app.options.apiKey + ":DEFAULT");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("firebase:")) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("firebase:")) sessionStorage.removeItem(key);
      });
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
    } catch {}
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      clearAllAuthData();
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: COLORS.background }}
      >
        <div className="text-lg" style={{ color: COLORS.textSecondary }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: COLORS.background }}
      >
        <div
          className="p-8 rounded-2xl shadow-xl text-center"
          style={{
            background: COLORS.card,
            boxShadow: COLORS.shadow,
            border: `1.5px solid ${COLORS.border}`,
          }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.textSecondary }}>
            Not signed in
          </h2>
          <p className="mb-4" style={{ color: COLORS.textSecondary }}>
            Please log in to view your profile.
          </p>
          <a
            href="/login"
            className="inline-block px-5 py-2 rounded-full font-semibold transition"
            style={{
              background: COLORS.accent,
              color: "#fff",
              boxShadow: "0 2px 8px 0 rgba(191,161,129,0.10)",
            }}
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  // Settings modal (for password, notification, etc.)
  const SettingsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div
        className="rounded-2xl shadow-xl p-8 w-full max-w-md relative"
        style={{
          background: COLORS.card,
          boxShadow: COLORS.shadow,
          border: `1.5px solid ${COLORS.border}`,
        }}
      >
        <button
          className="absolute top-3 right-3 text-2xl"
          style={{ color: COLORS.accent, transition: "color 0.2s" }}
          onClick={() => setShowSettings(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.textSecondary }}>
          Account Settings
        </h3>
        <ul className="space-y-4">
          <li>
            <span className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
              Change Password
            </span>
            <a
              href="profile/password"
              className="hover:underline"
              style={{ color: COLORS.accent }}
            >
              Reset your password
            </a>
          </li>
          <li>
            <span className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
              Privacy
            </span>
            <a
              href="/privacy"
              className="hover:underline"
              style={{ color: COLORS.accent }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Privacy Policy
            </a>
          </li>
          <li>
            <span className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
              Delete Account
            </span>
            <a
              href="/contact"
              className="hover:underline"
              style={{ color: COLORS.accent }}
            >
              Contact support to delete your account
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  // Profile completion logic
  const profileFields = [
    user.displayName,
    user.email,
    profile?.phone,
    profile?.address,
  ];
  const profileCompletion =
    (profileFields.filter(Boolean).length / profileFields.length) * 100;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 sm:px-4"
      style={{ background: COLORS.background }}
    >
      {showSettings && <SettingsModal />}
      <div
        className="w-full max-w-3xl rounded-3xl shadow-2xl relative overflow-hidden"
        style={{
          background: COLORS.card,
          boxShadow: COLORS.shadow,
          border: `1.5px solid ${COLORS.border}`,
        }}
      >
        {/* Top Accent Bar */}
        <div
          className="h-3 w-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`,
          }}
        />
        {/* Settings button */}
        <button
          className="absolute top-6 right-6 text-2xl p-2 rounded-full hover:bg-[#F5E8D3] transition"
          style={{ color: COLORS.accent, background: "transparent" }}
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
          title="Account Settings"
        >
          <IoSettingsSharp />
        </button>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 px-8 py-10">
          {/* Profile Picture */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <div
              className="w-36 h-36 rounded-full border-4 shadow-lg flex items-center justify-center overflow-hidden mb-3"
              style={{
                background: COLORS.inputBg,
                borderColor: COLORS.accentLight,
                boxShadow: "0 2px 16px 0 rgba(191,161,129,0.10)",
              }}
            >
              <img
                src={user.photoURL || PROFILE_PIC_PLACEHOLDER}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="text-xs underline font-medium"
              style={{
                color: COLORS.accent,
                cursor: "not-allowed",
                opacity: 0.6,
              }}
              disabled
              title="Profile picture upload coming soon"
            >
              Change Photo
            </button>
          </div>
          {/* Profile Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold" style={{ color: COLORS.text }}>
                {profile?.displayName || "Your Name"}
              </h2>
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{
                  background: COLORS.accentLight,
                  color: COLORS.accent,
                  marginLeft: "0.5rem",
                  letterSpacing: "0.03em",
                }}
              >
                {profile?.role
                  ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                  : "User"}
              </span>
            </div>
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Email:
                </span>
                <span style={{ color: COLORS.text }}>{user.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                    Phone:
                  </span>
                  <span style={{ color: COLORS.text }}>{profile.phone}</span>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                    Address:
                  </span>
                  <span style={{ color: COLORS.text }}>{profile.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Account Created:
                </span>
                <span style={{ color: COLORS.text }}>
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
            {/* Profile Completion Bar */}
            <div className="mt-4 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
                  Profile Completion
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color:
                      profileCompletion === 100
                        ? COLORS.success
                        : COLORS.accent,
                  }}
                >
                  {Math.round(profileCompletion)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F5E8D3] overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${profileCompletion}%`,
                    background:
                      profileCompletion === 100
                        ? COLORS.success
                        : `linear-gradient(90deg, ${COLORS.accent} 60%, ${COLORS.accentLight} 100%)`,
                  }}
                />
              </div>
            </div>
            {/* Edit Profile Button */}
            <button
              onClick={handleEdit}
              className="mt-4 px-5 py-2 rounded-full font-semibold transition"
              style={{
                background: COLORS.accent,
                color: "#fff",
                boxShadow: "0 2px 8px 0 rgba(191,161,129,0.10)",
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Editable Form */}
        {editing && (
          <form
            className="px-8 pb-8 border-t pt-6 space-y-4"
            style={{ borderColor: COLORS.border }}
            onSubmit={handleEditSave}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.textSecondary }}>
              Edit Profile
            </h3>
            {error && (
              <div className="text-sm mb-2" style={{ color: COLORS.error }}>
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
                  Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  className="w-full rounded-lg px-3 py-2"
                  style={{
                    background: COLORS.inputBg,
                    color: COLORS.text,
                    border: `1.5px solid ${COLORS.inputBorder}`,
                  }}
                  value={editData.displayName || ""}
                  onChange={handleEditChange}
                  placeholder="Your Name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg px-3 py-2"
                  style={{
                    background: COLORS.inputBg,
                    color: COLORS.text,
                    border: `1.5px solid ${COLORS.inputBorder}`,
                  }}
                  value={editData.phone || ""}
                  onChange={handleEditChange}
                  placeholder="Your phone number"
                  autoComplete="tel"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full rounded-lg px-3 py-2"
                  style={{
                    background: COLORS.inputBg,
                    color: COLORS.text,
                    border: `1.5px solid ${COLORS.inputBorder}`,
                  }}
                  value={editData.address || ""}
                  onChange={handleEditChange}
                  placeholder="Your address"
                  autoComplete="street-address"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="px-5 py-2 rounded-full font-semibold transition disabled:opacity-60"
                style={{
                  background: COLORS.accent,
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 rgba(191,161,129,0.10)",
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-full font-semibold transition"
                style={{
                  background: COLORS.inputBg,
                  color: COLORS.textSecondary,
                  border: `1.5px solid ${COLORS.border}`,
                }}
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* Divider */}
        <div className="border-t px-8 py-8 flex flex-col md:flex-row gap-8 items-start" style={{ borderColor: COLORS.border }}>
          {/* Account Info */}
          <div className="flex-1 w-full">
            <h4 className="text-lg font-bold mb-2" style={{ color: COLORS.textSecondary }}>
              Account Info
            </h4>
            <ul className="text-sm space-y-1">
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  User ID:
                </span>{" "}
                <span style={{ color: COLORS.text }}>{user.uid}</span>
              </li>
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Email Verified:
                </span>{" "}
                <span style={{ color: user.emailVerified ? COLORS.success : COLORS.error }}>
                  {user.emailVerified ? "Yes" : "No"}
                </span>
              </li>
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Last Sign-in:
                </span>{" "}
                <span style={{ color: COLORS.text }}>
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Creation Time:
                </span>{" "}
                <span style={{ color: COLORS.text }}>
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleString()
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
          {/* Profile Status */}
          <div className="flex-1 w-full">
            <h4 className="text-lg font-bold mb-2" style={{ color: COLORS.textSecondary }}>
              Profile Status
            </h4>
            <ul className="text-sm space-y-1">
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Profile Completion:
                </span>{" "}
                <span
                  style={{
                    color:
                      profileCompletion === 100
                        ? COLORS.success
                        : COLORS.accent,
                  }}
                >
                  {Math.round(profileCompletion)}%
                </span>
              </li>
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Photo:
                </span>{" "}
                <span style={{ color: COLORS.text }}>
                  {user.photoURL ? "Set" : "Not set"}
                </span>
              </li>
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Role:
                </span>{" "}
                <span style={{ color: COLORS.text }}>
                  {profile?.role
                    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                  Notifications:
                </span>{" "}
                <span style={{ color: COLORS.accent }}>Coming soon</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Sign Out Button */}
        <div className="px-8 pb-8">
          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-full font-semibold transition disabled:opacity-60"
            style={{
              background: COLORS.accent,
              color: "#fff",
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px 0 rgba(191,161,129,0.10)",
              marginTop: "1.5rem",
            }}
            disabled={signingOut}
          >
            {signingOut ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      </div>
    </div>
  );
}
