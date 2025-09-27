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
import { auth, db } from "../../../lib/firebase";
import { UserProfile } from "../../../types/types";
import { IoSettingsSharp } from "react-icons/io5";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { MdEdit, MdOutlineVerified } from "react-icons/md";


// Color palette
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

  // New state for editing bio
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState<string>(""); // for editing bio
  const [savingBio, setSavingBio] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);

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
      localStorage.removeItem(
        "firebase:authUser:" + auth.app.options.apiKey + ":" + auth.name
      );
      localStorage.removeItem(
        "firebase:authUser:" + auth.app.options.apiKey + ":DEFAULT"
      );
      localStorage.removeItem(
        "firebase:redirectEvent:" + auth.app.options.apiKey + ":DEFAULT"
      );
      sessionStorage.removeItem(
        "firebase:authUser:" + auth.app.options.apiKey + ":" + auth.name
      );
      sessionStorage.removeItem(
        "firebase:authUser:" + auth.app.options.apiKey + ":DEFAULT"
      );
      sessionStorage.removeItem(
        "firebase:redirectEvent:" + auth.app.options.apiKey + ":DEFAULT"
      );
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("firebase:")) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("firebase:")) sessionStorage.removeItem(key);
      });
      if (typeof document !== "undefined") {
        document.cookie.split(";").forEach((c) => {
          if (
            c.trim().startsWith("__session") ||
            c.trim().startsWith("firebase")
          ) {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/"
              );
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
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    }
    setSaving(false);
  };

  // New: handle edit bio
  const handleEditBio = () => {
    setBioValue(profile?.why || "");
    setEditingBio(true);
    setBioError(null);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBioValue(e.target.value);
  };

  const handleBioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingBio(true);
    setBioError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        why: bioValue,
      });
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
      setEditingBio(false);
    } catch (err: unknown) {
      setBioError(
        err instanceof Error ? err.message : "Failed to update bio."
      );
    }
    setSavingBio(false);
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
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: COLORS.textSecondary }}
          >
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

  // Settings modal
  const SettingsModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)" }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/20">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-800"
          onClick={() => setShowSettings(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Account Settings
        </h3>
        <ul className="space-y-4">
          <li>
            <a
              href="/password"
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#3d676d" }}
            >
              Change Password
            </a>
          </li>
          <li>
            <a
              href="/privacy"
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#3d676d" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#3d676d" }}
            >
              Delete Account
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  const profileFields = [
    user.displayName,
    user.email,
    profile?.phone,
    profile?.address,
  ];
  const profileCompletion =
    (profileFields.filter(Boolean).length / profileFields.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      {showSettings && <SettingsModal />}

      <div className="w-full max-w-md">
        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          {/* Elegant Header */}
          <div
            className="h-32 relative "
            style={{
              background:
                "linear-gradient(135deg, #3d676d 0%, #527278 50%, #6b8388 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <IoSettingsSharp size={18} />
            </button>

            {/* Profile Picture */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                <img
                  src={
                    user.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {user.emailVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3d676d] rounded-full flex items-center justify-center border-2 border-white">
                  <MdOutlineVerified size={14} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-16 px-6 pb-6">
            {/* Name & Role */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {profile?.displayName || "Your Name"}
              </h1>
              <div
                className="inline-flex items-center px-4 py-1.5 text-white text-sm font-medium rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
                }}
              >
                {profile?.role
                  ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                  : "User"}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6 px-2">
              {editingBio ? (
                <form onSubmit={handleBioSave}>
                  <textarea
                    name="why"
                    value={bioValue}
                    onChange={handleBioChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all mb-2"
                    placeholder="This is your short bio. Write 2–3 sentences to describe yourself."
                    disabled={savingBio}
                  />
                  {bioError && (
                    <div className="bg-red-50 text-red-600 p-2 rounded-xl mb-2 text-sm">
                      {bioError}
                    </div>
                  )}
                  <div className="flex space-x-2 justify-end">
                    <button
                      type="submit"
                      disabled={savingBio}
                      className="text-white py-2 px-4 rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
                      }}
                    >
                      {savingBio ? "Saving..." : "Save Bio"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBio(false)}
                      disabled={savingBio}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-2 w-full">
                    {profile?.why ||
                      "This is your short bio. Write 2–3 sentences to describe yourself."}
                  </p>
                  <button
                    onClick={handleEditBio}
                    className="flex items-center text-xs text-[#3d676d] hover:underline hover:text-[#527278] transition mb-2"
                  >
                    <MdEdit size={16} className="mr-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <IoMailOutline size={16} className="text-blue-600" />
                </div>
                <span className="text-gray-700 text-sm">{user.email}</span>
              </div>

              {profile?.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <IoCallOutline size={16} className="text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{profile.phone}</span>
                </div>
              )}

              {profile?.address && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <IoLocationOutline size={16} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-sm">
                    {profile.address}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-4">
              <button
                onClick={handleEdit}
                className="flex-1 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
                }}
              >
                <MdEdit size={18} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => alert("Share profile coming soon!")}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200"
              >
                <IoShareSocialOutline size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="mt-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Edit Profile
            </h3>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={editData.displayName || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editData.address || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  placeholder="Your address"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={saving}
                  className="flex-1 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Card */}
        <div className="mt-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <details className="group">
            {/* Stats/Completion */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-green-600">
                  {Math.round(profileCompletion)}%
                </span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
            <summary className="p-6 cursor-pointer hover:bg-white/40 transition-all duration-200">
              <span className="font-medium text-gray-800">Account Details</span>
            </summary>
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Account</h4>
                  <div className="space-y-1 text-gray-600">
                    <div>ID: {user.uid.substring(0, 8)}...</div>
                    <div>Verified: {user.emailVerified ? "Yes" : "No"}</div>
                    <div>
                      Member since:{" "}
                      {user.metadata?.creationTime
                        ? new Date(
                            user.metadata.creationTime
                          ).toLocaleDateString()
                        : "Unknown"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Settings</h4>
                  <div className="space-y-1 text-gray-600">
                    <div>Role: {profile?.role || "N/A"}</div>
                    {/* <div>
                      Notifications: {profile?.notifications ? "On" : "Off"}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Sign Out */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
