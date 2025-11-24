import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const missionsSnap = await adminDb.collection("missions").get();
    const usersSnap = await adminDb.collection("users").get();

    let totalMissions = 0;
    const byStatus: Record<string, number> = {};
    let revenueLast7Days = 0;
    let revenueLast30Days = 0;
    let todayMissions = 0;

    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    const last7 = now.getTime() - 7 * msInDay;
    const last30 = now.getTime() - 30 * msInDay;

    missionsSnap.forEach((doc) => {
      totalMissions += 1;
      const data = doc.data() as {
        status?: string;
        price?: number;
        createdAt?: FirebaseFirestore.Timestamp;
        date?: string;
      };

      const statusKey = (data.status || "unknown").toString();
      byStatus[statusKey] = (byStatus[statusKey] || 0) + 1;

      if (typeof data.price === "number") {
        const createdAt: Date | null = data.createdAt
          ? data.createdAt.toDate()
          : data.date
          ? new Date(data.date)
          : null;

        if (createdAt && !isNaN(createdAt.getTime())) {
          const t = createdAt.getTime();
          if (t >= last30) revenueLast30Days += data.price;
          if (t >= last7) revenueLast7Days += data.price;

          const isToday =
            createdAt.toDateString() === now.toDateString() ||
            (data.date &&
              new Date(data.date).toDateString() === now.toDateString());
          if (isToday) todayMissions += 1;
        }
      }
    });

    let providers = 0;
    let customers = 0;
    usersSnap.forEach((doc) => {
      const role = (doc.data() as { role?: string }).role;
      if (role === "provider") providers += 1;
      if (role === "customer") customers += 1;
    });

    return NextResponse.json({
      missions: {
        totalMissions,
        byStatus,
        revenueLast7Days,
        revenueLast30Days,
        todayMissions,
      },
      users: { providers, customers },
    });
  } catch (err) {
    console.error("[API /api/admin/overview] Failed to load data", err);
    return NextResponse.json(
      { error: "Failed to load admin overview data." },
      { status: 500 }
    );
  }
}



