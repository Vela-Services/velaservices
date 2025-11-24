import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("users")
      .where("role", "==", "provider")
      .get();

    const providers = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));

    return NextResponse.json({ providers });
  } catch (err) {
    console.error("[API /api/admin/providers] Failed to load data", err);
    return NextResponse.json(
      { error: "Failed to load providers." },
      { status: 500 }
    );
  }
}



