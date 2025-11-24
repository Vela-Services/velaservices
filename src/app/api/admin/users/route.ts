import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await adminDb.collection("users").get();

    const users = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error("[API /api/admin/users] Failed to load data", err);
    return NextResponse.json(
      { error: "Failed to load users." },
      { status: 500 }
    );
  }
}

