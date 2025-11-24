import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("users")
      .where("role", "==", "customer")
      .get();

    const customers = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));

    return NextResponse.json({ customers });
  } catch (err) {
    console.error("[API /api/admin/customers] Failed to load data", err);
    return NextResponse.json(
      { error: "Failed to load customers." },
      { status: 500 }
    );
  }
}



