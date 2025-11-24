import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const missionsSnap = await adminDb
      .collection("missions")
      .orderBy("date", "desc")
      .get();

    const missions = missionsSnap.docs.map((doc) => {
      const data = doc.data() as {
        price?: number;
        status?: string;
        serviceName?: string;
        date?: string;
        userName?: string;
        providerName?: string;
        stripePaymentIntentId?: string;
        stripeAccountId?: string;
        transferId?: string;
        cancellationRefundType?: string;
      };
      return {
        id: doc.id,
        ...data,
      };
    });

    let gross = 0;
    let paidOut = 0;
    let awaiting = 0;
    missions.forEach((m) => {
      const price = typeof m.price === "number" ? m.price : 0;
      const status = (m.status || "").toLowerCase();
      if (price > 0) {
        gross += price;
        if (status === "paid_out") paidOut += price;
        if (status === "completed_by_customer") awaiting += price;
      }
    });

    return NextResponse.json({
      missions,
      totals: { gross, paidOut, awaiting },
    });
  } catch (err) {
    console.error("[API /api/admin/payments] Failed to load data", err);
    return NextResponse.json(
      { error: "Failed to load payments overview." },
      { status: 500 }
    );
  }
}



