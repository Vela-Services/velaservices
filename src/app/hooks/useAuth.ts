import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/types/types";

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = userDoc.exists()
          ? (userDoc.data() as UserProfile)
          : null;
        setProfile(data);

        // Keep a simple role cookie in sync for middleware / SSR.
        // This complements (and can override) the cookie set on login.
        if (typeof document !== "undefined") {
          const role = data?.role;
          if (role) {
            document.cookie = `role=${role}; path=/; max-age=604800`;
          } else {
            // Clear role cookie if no role is found
            document.cookie =
              "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        }
      } else {
        setProfile(null);
        if (typeof document !== "undefined") {
          document.cookie =
            "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const role = profile?.role;
  const isCustomer = role === "customer";
  const isProvider = role === "provider";
  const isAdmin = role === "admin" || !!profile?.isSuperAdmin;

  return {
    profile,
    user,
    loading,
    role,
    isCustomer,
    isProvider,
    isAdmin,
  };
}