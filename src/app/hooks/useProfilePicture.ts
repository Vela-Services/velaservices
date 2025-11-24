import { useState } from "react";
import { User, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getApp } from "firebase/app";
import { db, storage } from "@/lib/firebase";
import { convertToJpeg, compressImage, extractStoragePath } from "@/lib/imageUtils";

export function useProfilePicture(user: User | null) {
  const [uploading, setUploading] = useState(false);

  const changeProfilePicture = async (file: File) => {
    if (!user) {
      alert("User not found.");
      return;
    }

    setUploading(true);
    try {
      // Convert HEIC to JPEG if needed
      const jpegFile = await convertToJpeg(file);
      const fileName = `${Date.now()}_${jpegFile.name}`;
      const storageRef = ref(storage, `users/${user.uid}/profilePicture/${fileName}`);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // Check 24-hour limit
      if (userSnap.exists()) {
        const lastUpload = userSnap.data().lastProfilePictureUpdate;
        if (lastUpload) {
          const lastUploadDate = lastUpload.toDate();
          const now = new Date();
          const hoursSinceLastUpload =
            (now.getTime() - lastUploadDate.getTime()) / (1000 * 60 * 60);

          if (hoursSinceLastUpload < 24) {
            alert("Tu ne peux changer ta photo qu'une fois par jour.");
            setUploading(false);
            return;
          }
        }
      }

      // Delete old photo if exists
      const oldPhotoURL = userSnap.data()?.photoURL;
      if (oldPhotoURL) {
        try {
          const bucket =
            process.env.NEXT_PUBLIC_STORAGE_BUCKET ||
            getApp().options.storageBucket ||
            "";
          const filePath = extractStoragePath(oldPhotoURL, bucket);
          if (filePath) {
            const oldPhotoRef = ref(storage, filePath);
            await deleteObject(oldPhotoRef);
          }
        } catch (error) {
          console.error("Impossible de supprimer l'ancienne photo:", error);
          // Continue even if deletion fails
        }
      }

      // Compress and upload
      const compressedFile = await compressImage(jpegFile);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firebase Auth and Firestore
      await updateProfile(user, { photoURL: downloadURL });
      await updateDoc(userRef, {
        photoURL: downloadURL,
        lastProfilePictureUpdate: serverTimestamp(),
      });

      // Reload page to show new photo
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert(
        "There was an error updating your profile picture. Please try again later."
      );
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    changeProfilePicture,
  };
}

