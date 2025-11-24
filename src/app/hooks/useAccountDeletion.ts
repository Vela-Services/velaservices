import { useState } from "react";
import { User, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { getApp } from "firebase/app";
import { db, storage } from "@/lib/firebase";
import { UserProfile } from "@/types/types";
import { extractStoragePath } from "@/lib/imageUtils";
import { clearAllAuthData } from "@/lib/authUtils";

export function useAccountDeletion() {
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUserData = async (userId: string, profile: UserProfile | null) => {
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", userId));

      // Delete profile picture from Storage if it exists
      if (profile?.photoURL) {
        try {
          const bucket =
            process.env.NEXT_PUBLIC_STORAGE_BUCKET ||
            getApp().options.storageBucket ||
            "";
          const filePath = extractStoragePath(profile.photoURL, bucket);
          if (filePath) {
            const photoRef = ref(storage, filePath);
            await deleteObject(photoRef);
          }
        } catch (error) {
          console.error("Error deleting profile picture:", error);
          // Don't fail the entire operation if photo deletion fails
        }
      }

      console.log("User data deleted successfully");
    } catch (error) {
      console.error("Error deleting user data:", error);
      throw error;
    }
  };

  const deleteAccount = async (user: User, profile: UserProfile | null) => {
    if (!user) return;

    setDeletingAccount(true);
    setError(null);

    try {
      // First delete user data from Firestore
      await deleteUserData(user.uid, profile);

      // Then delete the user account from Firebase Auth
      await deleteUser(user);

      // Clear all auth data
      clearAllAuthData();

      // Redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again or contact support.");
      setDeletingAccount(false);
    }
  };

  return {
    deletingAccount,
    error,
    deleteAccount,
    setError,
  };
}

