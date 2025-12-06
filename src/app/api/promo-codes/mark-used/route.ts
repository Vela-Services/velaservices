import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { code, userId } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Normalize code to uppercase for case-insensitive matching
    const normalizedCode = code.toUpperCase().trim();

    // Find the promo code in Firestore
    const promoCodeQuery = await adminDb
      .collection("promoCodes")
      .where("code", "==", normalizedCode)
      .limit(1)
      .get();

    if (promoCodeQuery.empty) {
      return NextResponse.json(
        { error: "Promo code not found" },
        { status: 404 }
      );
    }

    const promoCodeDoc = promoCodeQuery.docs[0];
    const promoCode = promoCodeDoc.data();

    // Check if user has already used this code
    const usedBy = promoCode.usedBy || [];
    if (usedBy.includes(userId)) {
      // Already used, but return success to avoid errors on retry
      return NextResponse.json({ success: true, alreadyUsed: true });
    }

    // Add user to usedBy array
    await adminDb
      .collection("promoCodes")
      .doc(promoCodeDoc.id)
      .update({
        usedBy: [...usedBy, userId],
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking promo code as used:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to mark promo code as used: ${message}` },
      { status: 500 }
    );
  }
}

