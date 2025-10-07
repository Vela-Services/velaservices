"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  onAuthStateChanged,
  User,
  signOut,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../../../lib/firebase";
import { UserProfile } from "../../../types/types";
import { IoSettingsSharp } from "react-icons/io5";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoShareSocialOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { MdEdit, MdOutlineVerified, MdPhotoCamera } from "react-icons/md";
import { getApp } from "firebase/app";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import imageCompression from "browser-image-compression";

const ProviderStripeSetup = React.lazy(() =>
  import("../../(provider)/ProviderStripeSetup/page").then((mod) => ({
    default: mod.default,
  }))
);

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

  // Stripe status for provider onboarding
  const [stripeStatus, setStripeStatus] = useState<{
    accountId?: string;
    onboardingStatus?: "pending" | "active" | "incomplete";
    chargesEnabled?: boolean;
  }>({});
  const [, setStripeLoading] = useState(false);

  // Simulate services and availability for demo
  // In a real app, fetch these from Firestore or API
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<boolean>(false);

  // For walkthrough step highlighting
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  // --- Fetch user, profile, and provider Stripe status ---
  useEffect(() => {
    if (typeof window === "undefined") return;

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
                const data = userDoc.data() as UserProfile;
                setProfile(data);

                // Simulate services and availability
                setServices(data.services || []);
                setAvailability(!!data.availability);

                // If provider, fetch Stripe status
                if (data.role === "provider") {
                  setStripeLoading(true);
                  try {
                    // Simulate fetching Stripe status from Firestore
                    setStripeStatus({
                      accountId: data.stripeAccountId,
                      onboardingStatus: data.stripeOnboardingStatus,
                      chargesEnabled: data.stripeChargesEnabled,
                    });
                  } catch {
                    setStripeStatus({});
                  }
                  setStripeLoading(false);
                }
              } else {
                setProfile(null);
                setServices([]);
                setAvailability(false);
                setStripeStatus({});
                console.log("No userDoc found for user");
              }
            } catch (err) {
              setProfile(null);
              setServices([]);
              setAvailability(false);
              setStripeStatus({});
              console.error("Error loading userDoc:", err);
            }
          } else {
            setProfile(null);
            setServices([]);
            setAvailability(false);
            setStripeStatus({});
            console.log("No firebaseUser in onAuthStateChanged");
          }
          setLoading(false);
        });
      });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const clearAllAuthData = () => {
    if (typeof window === "undefined") return;
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
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
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
      setBioError(err instanceof Error ? err.message : "Failed to update bio.");
    }
    setSavingBio(false);
  };

  const convertToJpeg = async (file: File) => {
    if (typeof window === "undefined") return file;
    if (file.type === "image/heic" || file.type === "image/heif") {
      const { default: heic2any } = await import("heic2any");
      const blob = await heic2any({ blob: file, toType: "image/jpeg" });
      return new File([blob as Blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
    }
    return file;
  };

  const changeProfilePicture = async () => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const fileInput = document.getElementById(
      "profilePicture"
    ) as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      console.error("No file selected");
      return;
    }

    const file = fileInput.files[0];
    const jpegFile = await convertToJpeg(file);
    const fileName = `${Date.now()}_${jpegFile.name}`;
    const userId = user?.uid;
    if (!userId) {
      if (typeof window !== "undefined") {
        alert("User not found.");
      }
      return;
    }
    const storageRef = ref(
      storage,
      `users/${userId}/profilePicture/${fileName}`
    );
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const lastUpload = userSnap.data().lastProfilePictureUpdate;
      if (lastUpload) {
        const lastUploadDate = lastUpload.toDate();
        const now = new Date();
        const hoursSinceLastUpload =
          (now.getTime() - lastUploadDate.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastUpload < 24) {
          console.error("Tu ne peux changer ta photo qu'une fois par jour.");
          if (typeof window !== "undefined") {
            alert("Tu ne peux changer ta photo qu'une fois par jour.");
          }
          return;
        }
      }
    }

    try {
      const oldPhotoURL = userSnap.data()?.photoURL;
      if (oldPhotoURL) {
        try {
          const bucket =
            process.env.NEXT_PUBLIC_STORAGE_BUCKET ||
            getApp().options.storageBucket ||
            "";
          if (
            bucket &&
            oldPhotoURL.includes(bucket) &&
            oldPhotoURL.startsWith("https://")
          ) {
            const url = new URL(oldPhotoURL);
            const pathMatch = url.pathname.match(/\/o\/(.+)$/);
            let filePath = "";
            if (pathMatch && pathMatch[1]) {
              filePath = decodeURIComponent(pathMatch[1].split("?")[0]);
            }
            if (filePath) {
              const oldPhotoRef = ref(storage, filePath);
              await deleteObject(oldPhotoRef);
            }
          }
        } catch (error) {
          console.error("Impossible de supprimer l'ancienne photo:", error);
        }
      }

      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(jpegFile, options);

      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateProfile(user, { photoURL: downloadURL });
      await updateDoc(userRef, {
        photoURL: downloadURL,
        lastProfilePictureUpdate: serverTimestamp(),
      });

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      if (typeof window !== "undefined") {
        alert(
          "There was an error updating your profile picture. Please try again later."
        );
      }
    }
  };

  // --- Profile Completion Calculation & Walkthrough Steps ---
  // Steps: name, email, phone, address, bio, photo, (provider: Stripe, services, availability)
  const steps: {
    key: string;
    label: string;
    description: string;
    completed: boolean;
    action?: () => void;
    highlight?: boolean;
    providerOnly?: boolean;
    stripeStep?: boolean;
  }[] = [
    {
      key: "displayName",
      label: "Add your name",
      description: "Let clients know who you are.",
      completed: !!profile?.displayName,
      action: handleEdit,
      highlight: !profile?.displayName,
    },
    {
      key: "email",
      label: "Verify your email",
      description: user?.emailVerified
        ? "Your email is verified."
        : "Verify your email to secure your account.",
      completed: !!user?.email && user?.emailVerified,
      action: () => {
        if (!user?.emailVerified) {
          alert("Check your inbox for a verification email.");
        }
      },
      highlight: !!user?.email && !user?.emailVerified,
    },
    {
      key: "phone",
      label: "Add your phone number",
      description: "Clients can contact you easily.",
      completed: !!profile?.phone,
      action: handleEdit,
      highlight: !profile?.phone,
    },
    {
      key: "address",
      label: "Add your address",
      description: "Let clients know where you are based.",
      completed: !!profile?.address,
      action: handleEdit,
      highlight: !profile?.address,
    },
    {
      key: "bio",
      label: "Write a short bio",
      description: "Tell clients about yourself.",
      completed: !!profile?.why,
      action: handleEditBio,
      highlight: !profile?.why,
    },
    {
      key: "photo",
      label: "Add a profile picture",
      description: "A friendly face builds trust.",
      completed: !!user?.photoURL || !!profile?.photoURL,
      action: () => {
        const input = document.getElementById("profilePicture");
        if (input) input.click();
      },
      highlight: !(user?.photoURL || profile?.photoURL),
    },
    // Provider-specific steps
    {
      key: "stripe",
      label: "Set up payments (Stripe)",
      description: "Enable payments and payouts.",
      completed:
        profile?.role === "provider"
          ? !!stripeStatus.accountId &&
            stripeStatus.onboardingStatus === "active"
          : true,
      action: undefined, // handled in Stripe card
      providerOnly: true,
      stripeStep: true,
      highlight:
        profile?.role === "provider" &&
        (!stripeStatus.accountId ||
          stripeStatus.onboardingStatus !== "active" ||
          !stripeStatus.chargesEnabled),
    },
    {
      key: "services",
      label: "Add your services",
      description: "Let clients know what you offer.",
      completed:
        profile?.role === "provider" ? services && services.length > 0 : true,
      action: () => alert("Service management coming soon!"),
      providerOnly: true,
      highlight:
        profile?.role === "provider" && (!services || services.length === 0),
    },
    {
      key: "availability",
      label: "Set your availability",
      description: "Let clients know when you are available.",
      completed: profile?.role === "provider" ? !!availability : true,
      action: () => alert("Availability management coming soon!"),
      providerOnly: true,
      highlight: profile?.role === "provider" && !availability,
    },
  ];

  // Only show provider steps if user is provider
  const visibleSteps = steps.filter(
    (step) => !step.providerOnly || profile?.role === "provider"
  );

  const completedSteps = visibleSteps.filter((step) => step.completed).length;
  const profileCompletion = Math.round(
    (completedSteps / visibleSteps.length) * 100
  );

  // --- Walkthrough Card ---
  const WalkthroughCard = () => (
    <div className="mb-6 bg-white/90 rounded-2xl shadow-lg border border-white/30 p-5">
      <div className="flex items-center mb-3">
        <IoAlertCircleOutline className="text-yellow-500 mr-2" size={22} />
        <h3 className="text-lg font-bold text-gray-800">
          Complete your profile
        </h3>
      </div>
      <p className="text-gray-600 mb-4 text-sm">
        To unlock all features and get the most out of the platform, please
        complete your profile. Follow the steps below:
      </p>
      <ol className="space-y-3">
        {visibleSteps.map((step) => (
          <li
            key={step.key}
            className={`flex items-start space-x-3 ${
              step.highlight ? "bg-yellow-50 border-l-4 border-yellow-300" : ""
            } rounded-xl px-2 py-2`}
          >
            <div className="pt-1">
              {step.completed ? (
                <IoCheckmarkCircleOutline
                  className="text-green-500"
                  size={20}
                />
              ) : (
                <IoCloseCircleOutline className="text-gray-300" size={20} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span
                  className={`font-medium ${
                    step.completed
                      ? "text-green-700"
                      : step.highlight
                      ? "text-yellow-800"
                      : "text-gray-700"
                  }`}
                >
                  {step.label}
                </span>
                {step.highlight && !step.completed && step.action && (
                  <button
                    onClick={step.action}
                    className="ml-2 text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-900 hover:bg-yellow-300 transition"
                  >
                    Complete
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-500">{step.description}</span>
              {/* Stripe step: show inline Stripe onboarding if not complete */}
              {step.stripeStep &&
                profile?.role === "provider" &&
                !step.completed && (
                  <div className="mt-2">
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center py-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                          <span className="text-gray-600 text-xs">
                            Loading Stripe...
                          </span>
                        </div>
                      }
                    >
                      <ProviderStripeSetup />
                    </Suspense>
                  </div>
                )}
            </div>
          </li>
        ))}
      </ol>
      {profileCompletion === 100 ? (
        <div className="mt-4 flex items-center text-green-700 font-semibold">
          <IoCheckmarkCircleOutline className="mr-2" size={20} />
          Your profile is 100% complete! You`&apos;`re ready to go.
        </div>
      ) : (
        <div className="mt-4 flex items-center text-yellow-700 font-semibold">
          <IoAlertCircleOutline className="mr-2" size={20} />
          {100 - profileCompletion}% left to complete your profile.
        </div>
      )}
      {showWalkthrough && (
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
          onClick={() => setShowWalkthrough(false)}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      {showSettings && <SettingsModal />}

      <div className="w-full max-w-md">
        {/* Walkthrough Card */}
        {profileCompletion !== 100 && <WalkthroughCard />}

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
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl relative group flex items-center justify-center">
                <img
                  src={
                    user.photoURL ||
                    profile?.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Change Picture Button - now a nice circular overlay */}
                <label
                  htmlFor="profilePicture"
                  className="absolute -top-1 -left-1 w-8 h-8 bg-[#3d676d] rounded-full flex items-center justify-center border-2 border-white"
                  title="Changer la photo de profil"
                  style={{ boxShadow: "0 2px 8px 0 rgba(61,103,109,0.15)" }}
                >
                  <MdPhotoCamera size={18} className="text-white" />
                  <input
                    type="file"
                    id="profilePicture"
                    onChange={changeProfilePicture}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
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

            {/* Provider Stripe Setup, Services, Availability - now handled in walkthrough */}
            <div>
              {profile?.role === "provider" && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <>
                    <div className="mt-2">
                      <React.Suspense
                        fallback={<span>Loading Stripe setup...</span>}
                      >
                        <ProviderStripeSetup />
                      </React.Suspense>
                    </div>
                  </>
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
                  {profileCompletion}%
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
