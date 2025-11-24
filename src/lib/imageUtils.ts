import imageCompression from "browser-image-compression";

/**
 * Converts HEIC/HEIF images to JPEG format
 */
export async function convertToJpeg(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  if (file.type === "image/heic" || file.type === "image/heif") {
    const { default: heic2any } = await import("heic2any");
    const blob = await heic2any({ blob: file, toType: "image/jpeg" });
    return new File([blob as Blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  }
  return file;
}

/**
 * Compresses an image file with specified options
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

/**
 * Extracts the storage path from a Firebase Storage URL
 */
export function extractStoragePath(photoURL: string, bucket: string): string | null {
  if (!bucket || !photoURL.includes(bucket) || !photoURL.startsWith("https://")) {
    return null;
  }

  try {
    const url = new URL(photoURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)$/);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1].split("?")[0]);
    }
  } catch (error) {
    console.error("Error parsing storage URL:", error);
  }

  return null;
}

