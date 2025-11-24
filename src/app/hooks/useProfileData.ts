import { useState } from "react";
import { User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/types";

export function useProfileData(user: User | null) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update profile fields (name, phone, address)
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    setSaving(true);
    setError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: data.displayName || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Update bio
  const updateBio = async (bio: string) => {
    if (!user) return;

    setSaving(true);
    setError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        why: bio,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update bio.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    updateProfile,
    updateBio,
    setError,
  };
}

