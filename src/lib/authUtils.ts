import { auth } from "./firebase";

/**
 * Clears all Firebase authentication data from localStorage, sessionStorage, and cookies
 */
export function clearAllAuthData(): void {
  if (typeof window === "undefined") return;
  
  try {
    // Clear specific Firebase auth keys
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

    // Clear all Firebase-related keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("firebase:")) localStorage.removeItem(key);
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("firebase:")) sessionStorage.removeItem(key);
    });

    // Clear Firebase-related cookies
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
  } catch (error) {
    // Silently fail - this is a cleanup operation
    console.error("Error clearing auth data:", error);
  }
}

