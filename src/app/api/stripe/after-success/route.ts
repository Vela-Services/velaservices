import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/types/types";
import { adminDb } from "@/lib/firebaseAdmin";

type ProviderGroup = {
  providerId: string;
  providerName?: string;
  items: CartItem[];
  totalAmount: number;
};

export async function POST(req: NextRequest) {
  console.log("📦 after-success called");

  try {
    const body = await req.json();
    console.log("🧾 raw body:", body);

    const { cart, paymentIntentId } = body as {
      cart: CartItem[];
      paymentIntentId: string;
    };

    if (!cart?.length) throw new Error("Cart is empty or invalid");
    if (!paymentIntentId) throw new Error("Missing paymentIntentId");

    const providerGroups = cart.reduce<Record<string, ProviderGroup>>((acc, item) => {
      if (!item.providerId) {
        throw new Error(`Missing providerId for item: ${JSON.stringify(item)}`);
      }
      if (!acc[item.providerId]) {
        acc[item.providerId] = {
          providerId: item.providerId,
          providerName: item.providerName,
          items: [],
          totalAmount: 0,
        };
      }
      acc[item.providerId].items.push(item);
      acc[item.providerId].totalAmount += item.price;
      return acc;
    }, {});

    console.log("📝 pending_transfers to create:", Object.values(providerGroups));

    const batch = adminDb.batch();

    for (const group of Object.values(providerGroups)) {
      const docRef = adminDb
        .collection("pending_transfers")
        .doc(`${paymentIntentId}_${group.providerId}`);

      batch.set(docRef, {
        paymentIntentId,
        providerId: group.providerId,
        providerName: group.providerName || "Unknown Provider",
        amount: group.totalAmount,
        items: group.items,
        status: "pending_validation",
      });
    }

    try {
      await batch.commit();
      console.log("✅ Batch commit done");
    } catch (batchErr) {
      if (batchErr instanceof Error) {
        console.error("🔥 Firestore batch commit error:", batchErr);
        throw batchErr;
      } else {
        console.error("🔥 Firestore batch commit error:", batchErr);
        throw new Error("Unknown Firestore batch commit error");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error) {
      console.error("🔥 after-success error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error("🔥 after-success error:", err);
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
