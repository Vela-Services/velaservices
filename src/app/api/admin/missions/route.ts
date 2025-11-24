import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("missions")
      .orderBy("date", "desc")
      .get();

    const missions = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));

    return NextResponse.json({ missions });
  } catch (err) {
    console.error("[API /api/admin/missions] Failed to load data", err);
    return NextResponse.json(
      { error: "Failed to load missions." },
      { status: 500 }
    );
  }
}



