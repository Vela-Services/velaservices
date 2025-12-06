import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { PromoCode } from "@/types/types";

export async function POST(req: Request) {
  try {
    const { code, userId, cartTotal } = await req.json();

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
        { error: "Invalid promo code" },
        { status: 404 }
      );
    }

    const promoCodeDoc = promoCodeQuery.docs[0];
    const promoCode = { id: promoCodeDoc.id, ...promoCodeDoc.data() } as PromoCode;

    // Check if code is active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: "This promo code is no longer active" },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (promoCode.expiresAt) {
      const now = Timestamp.now();
      if (promoCode.expiresAt.toMillis() < now.toMillis()) {
        return NextResponse.json(
          { error: "This promo code has expired" },
          { status: 400 }
        );
      }
    }

    // Check if user has already used this code
    if (promoCode.usedBy && promoCode.usedBy.includes(userId)) {
      return NextResponse.json(
        { error: "You have already used this promo code" },
        { status: 400 }
      );
    }

    // Check if code has reached max uses
    if (promoCode.maxUses && promoCode.usedBy && promoCode.usedBy.length >= promoCode.maxUses) {
      return NextResponse.json(
        { error: "This promo code has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check minimum purchase amount
    if (promoCode.minPurchaseAmount && cartTotal < promoCode.minPurchaseAmount) {
      return NextResponse.json(
        { 
          error: `Minimum purchase amount of ${promoCode.minPurchaseAmount} NOK required for this promo code` 
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promoCode.discountType === "percentage") {
      discountAmount = Math.round((cartTotal * promoCode.discountValue) / 100 * 100) / 100;
    } else {
      discountAmount = promoCode.discountValue;
    }

    // Don't allow discount to exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      valid: true,
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discountAmount,
        description: promoCode.description,
      },
    });
  } catch (error) {
    console.error("Promo code validation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to validate promo code: ${message}` },
      { status: 500 }
    );
  }
}

