"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useProfileData } from "../../hooks/useProfileData";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import { useEmailVerification } from "../../hooks/useEmailVerification";
import { useAccountDeletion } from "../../hooks/useAccountDeletion";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";
import { clearAllAuthData } from "../../../lib/authUtils";
import { UserProfile } from "../../../types/types";
import { toast } from "react-hot-toast";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileBio } from "./components/ProfileBio";
import { ContactInfo } from "./components/ContactInfo";
import { ProfileWalkthrough } from "./components/ProfileWalkthrough";
import { ProfileEditForm } from "./components/ProfileEditForm";
import { SettingsModal } from "./components/SettingsModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { ProfileActions } from "./components/ProfileActions";
import { AccountDetails } from "./components/AccountDetails";
import { ProfileStats } from "./components/ProfileStats";
import { ProfileQuickLinks } from "./components/ProfileQuickLinks";
import { ProfileActivity } from "./components/ProfileActivity";

const ProviderStripeSetup = React.lazy(() =>
  import("../../(provider)/ProviderStripeSetup/page").then((mod) => ({
    default: mod.default,
  }))
);

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const {
    saving,
    error: profileError,
    updateProfile,
    updateBio,
    setError: setProfileError,
  } = useProfileData(user);
  const { changeProfilePicture } = useProfilePicture(user);
  const {
    resendingEmail,
    emailResent,
    error: emailError,
    resendVerificationEmail,
  } = useEmailVerification(user);
  const {
    deletingAccount,
    error: deleteError,
    deleteAccount,
  } = useAccountDeletion();

  const [signingOut, setSigningOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState<string>("");
  const [savingBio, setSavingBio] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [syncingStripe, setSyncingStripe] = useState(false);

  // Stripe status for provider onboarding
  const [stripeStatus, setStripeStatus] = useState<{
    accountId?: string;
    onboardingStatus?: "pending" | "active" | "incomplete";
    chargesEnabled?: boolean;
  }>({});
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<boolean>(false);


  // Set persistence and sync profile data
  useEffect(() => {
    if (typeof window === "undefined") return;

    setPersistence(auth, browserLocalPersistence).catch(() =>
      setPersistence(auth, browserSessionPersistence)
    );
  }, []);

  // Sync profile data from auth hook
  useEffect(() => {
    if (authProfile) {
      setServices(authProfile.services || []);
      setAvailability(!!authProfile.availability);

      if (authProfile.role === "provider") {
        setStripeStatus({
          accountId: authProfile.stripeAccountId,
          onboardingStatus: authProfile.stripeOnboardingStatus,
          chargesEnabled: authProfile.stripeChargesEnabled,
        });
      }
    }
  }, [authProfile]);

  // Sync Stripe status if account_id is in URL (from Stripe redirect)
  useEffect(() => {
    const accountId = searchParams.get("account_id");
    
    if (!accountId || !user?.uid || authLoading || syncingStripe) {
      return;
    }

    const syncStripeStatus = async () => {
      setSyncingStripe(true);
      try {
        console.log("🔄 Syncing Stripe status from profile page...", { accountId, providerId: user.uid });
        const res = await fetch("/api/stripe/sync-account-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId,
            providerId: user.uid,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.error) {
          console.error("❌ Sync error response:", data);
          throw new Error(data.error);
        }

        console.log("✅ Sync successful:", data);
        toast.success(
          `✅ Stripe connected! Status: ${data.onboardingStatus} (Charges: ${data.chargesEnabled ? "enabled" : "disabled"})`
        );

        // Remove account_id from URL
        router.replace("/profile", { scroll: false });
      } catch (err) {
        console.error("❌ Sync Stripe error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Error syncing Stripe: ${errorMessage}`);
        // Still remove account_id from URL even on error
        router.replace("/profile", { scroll: false });
      } finally {
        setSyncingStripe(false);
      }
    };

    syncStripeStatus();
  }, [searchParams, user?.uid, authLoading, syncingStripe, router]);

  const loading = authLoading;

  // Handler functions (defined before useProfileCompletion)
  const handleEdit = () => {
    setEditData({
      displayName: authProfile?.displayName || "",
      phone: authProfile?.phone || "",
      address: authProfile?.address || "",
    });
    setEditing(true);
    setProfileError(null);
  };

  const handleEditBio = () => {
    setBioValue(authProfile?.why || "");
    setEditingBio(true);
    setBioError(null);
  };

  // Profile completion hook
  const { steps, completion, showWalkthrough, setShowWalkthrough } =
    useProfileCompletion(
      user,
      authProfile,
      stripeStatus,
      services,
      availability,
      {
        onEdit: handleEdit,
        onEditBio: handleEditBio,
        onResendEmail: resendVerificationEmail,
        onPhotoClick: () => {
          const input = document.getElementById("profilePicture");
          if (input) input.click();
        },
      }
    );

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
    try {
      await updateProfile(editData);
      setEditing(false);
      // Reload to show updated profile
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      // Error is handled by hook
    }
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
      await updateBio(bioValue);
      setEditingBio(false);
      // Reload to show updated profile
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      setBioError(profileError || "Failed to update bio.");
      setSavingBio(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await changeProfilePicture(e.target.files[0]);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    await deleteAccount(user, authProfile);
  };

  const error = profileError || emailError || deleteError;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-lg text-gray-600">Loading profile...</div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="p-8 rounded-2xl shadow-xl text-center bg-white/80 backdrop-blur-xl border border-white/20">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Not signed in</h2>
          <p className="mb-4 text-gray-600">Please log in to view your profile.</p>
          <a
            href="/login"
            className="inline-block px-5 py-2 rounded-full font-semibold transition bg-[#3d676d] text-white hover:bg-[#527278]"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  const currentProfile = authProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          deletingAccount={deletingAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className="w-full max-w-4xl mx-auto">
        {/* Walkthrough Card */}
        {completion !== 100 && (
          <ProfileWalkthrough
            steps={steps}
            completion={completion}
            showWalkthrough={showWalkthrough}
            resendingEmail={resendingEmail}
            emailResent={emailResent}
            profile={currentProfile}
            onClose={() => setShowWalkthrough(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
              <ProfileHeader
                user={user}
                profile={currentProfile}
                onSettingsClick={() => setShowSettings(true)}
                onPhotoChange={handlePhotoChange}
              />

              {/* Content */}
              <div className="pt-20 px-6 pb-6">
                {/* Name & Role */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentProfile?.displayName || "Your Name"}
                  </h1>
                  <div
                    className="inline-flex items-center px-4 py-1.5 text-white text-sm font-medium rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
                    }}
                  >
                    {currentProfile?.role
                      ? currentProfile.role.charAt(0).toUpperCase() +
                        currentProfile.role.slice(1)
                      : "User"}
                  </div>
                </div>

                {/* Bio */}
                <ProfileBio
                  profile={currentProfile}
                  editingBio={editingBio}
                  bioValue={bioValue}
                  savingBio={savingBio}
                  bioError={bioError}
                  onEditBio={handleEditBio}
                  onBioChange={handleBioChange}
                  onBioSave={handleBioSave}
                  onCancel={() => setEditingBio(false)}
                />

                {/* Contact Info */}
                <ContactInfo
                  user={user}
                  profile={currentProfile}
                  resendingEmail={resendingEmail}
                  emailResent={emailResent}
                  onResendVerificationEmail={resendVerificationEmail}
                />

                {/* Provider Stripe Setup */}
                {currentProfile?.role === "provider" && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                    <Suspense fallback={<span>Loading Stripe setup...</span>}>
                      <ProviderStripeSetup />
                    </Suspense>
                  </div>
                )}

                {/* Action Buttons */}
                <ProfileActions onEdit={handleEdit} />
              </div>
            </div>

            {/* Edit Form */}
            {editing && (
              <ProfileEditForm
                editData={editData}
                saving={saving}
                error={error}
                onChange={handleEditChange}
                onSave={handleEditSave}
                onCancel={() => setEditing(false)}
              />
            )}
          </div>

          {/* Right Column - Stats, Links, Activity */}
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-white/20">
              <h2 className="text-base font-bold text-gray-800 mb-3">Overview</h2>
              <ProfileStats
                profile={currentProfile}
                user={user}
                completion={completion}
              />
            </div>

            {/* Quick Links */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-white/20">
              <ProfileQuickLinks profile={currentProfile} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-white/20">
              <ProfileActivity />
            </div>

            {/* Account Details */}
            <AccountDetails
              user={user}
              profile={currentProfile}
              completion={completion}
            />

            {/* Sign Out */}
            <div className="flex justify-center">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 px-6 rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-sm"
              >
                {signingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
