import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";

// --- Ensure service account object has string 'project_id' property ---
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "",
  project_id: process.env.FIREBASE_PROJECT_ID || "",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
  private_key: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "",
  client_id: process.env.FIREBASE_CLIENT_ID || "",
  auth_uri: process.env.FIREBASE_AUTH_URI || "",
  token_uri: process.env.FIREBASE_TOKEN_URI || "",
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "",
};

// Validate project_id is present and is a string
if (
  !serviceAccount.project_id ||
  typeof serviceAccount.project_id !== "string"
) {
  throw new Error(
    "Service account object must contain a string 'project_id' property"
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const adminDb = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accountId = body.accountId;
    const providerId = body.providerId;

    if (!accountId || !providerId) {
      return NextResponse.json(
        { error: "Missing accountId or providerId" },
        { status: 400 }
      );
    }

    // Retrieve Stripe account
    const account = await stripe.accounts.retrieve(accountId);

    const chargesEnabled = !!account.charges_enabled;
    const onboardingStatus = account.details_submitted ? "active" : "pending";

    // Update Firestore user document using admin SDK
    await adminDb.collection("users").doc(providerId).update({
      stripeAccountId: accountId,
      stripeChargesEnabled: chargesEnabled,
      stripeOnboardingStatus: onboardingStatus,
    });

    return NextResponse.json({
      ok: true,
      chargesEnabled,
      onboardingStatus,
    });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error("🔥 Error syncing Stripe account:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}