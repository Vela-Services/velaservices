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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PROD!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accountId = body.accountId;
    let providerId = body.providerId;

    if (!accountId) {
      return NextResponse.json(
        { error: "Missing accountId" },
        { status: 400 }
      );
    }

    // If providerId is not provided, try to find it by accountId
    if (!providerId) {
      console.log("⚠️ No providerId provided, searching by accountId:", accountId);
      const usersSnapshot = await adminDb
        .collection("users")
        .where("stripeAccountId", "==", accountId)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) {
        return NextResponse.json(
          { error: "No user found with this Stripe account ID" },
          { status: 404 }
        );
      }
      
      providerId = usersSnapshot.docs[0].id;
      console.log("✅ Found providerId:", providerId);
    }

    // Retrieve Stripe account
    const account = await stripe.accounts.retrieve(accountId);

    const needsMoreInfo =
      Array.isArray(account.requirements?.currently_due) &&
      account.requirements.currently_due.length > 0;
    const chargesEnabled = !!account.charges_enabled;
    const payoutsEnabled = !!account.payouts_enabled;
    const detailsSubmitted = !!account.details_submitted;
    
    // Determine onboarding status based on Stripe account state
    const onboardingStatus = needsMoreInfo
      ? "incomplete"
      : chargesEnabled
      ? "active"
      : "pending";

    // Log the account state for debugging
    console.log("📊 Stripe Account State:", {
      accountId,
      providerId,
      chargesEnabled,
      payoutsEnabled,
      detailsSubmitted,
      needsMoreInfo,
      currentlyDue: account.requirements?.currently_due || [],
      onboardingStatus,
    });

    // Verify the user document exists and check current accountId
    const userDoc = await adminDb.collection("users").doc(providerId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User document not found" },
        { status: 404 }
      );
    }

    const currentData = userDoc.data();
    const currentAccountId = currentData?.stripeAccountId;
    
    // If accountId doesn't match, log a warning but still update
    if (currentAccountId && currentAccountId !== accountId) {
      console.warn(
        `⚠️ AccountId mismatch! Firestore has: ${currentAccountId}, URL has: ${accountId}. Updating anyway.`
      );
    }

    // Update Firestore user document using admin SDK
    const updateData = {
      stripeAccountId: accountId,
      stripeChargesEnabled: chargesEnabled,
      stripePayoutsEnabled: payoutsEnabled,
      stripeOnboardingStatus: onboardingStatus,
    };

    await adminDb.collection("users").doc(providerId).update(updateData);
    console.log("✅ Updated Firestore with:", updateData);

    // Verify the update by reading back
    const updatedDoc = await adminDb.collection("users").doc(providerId).get();
    const updatedData = updatedDoc.data();
    console.log("🔍 Verification - Current Firestore status:", {
      stripeOnboardingStatus: updatedData?.stripeOnboardingStatus,
      stripeChargesEnabled: updatedData?.stripeChargesEnabled,
      stripeAccountId: updatedData?.stripeAccountId,
    });

    return NextResponse.json({
      ok: true,
      chargesEnabled,
      payoutsEnabled,
      detailsSubmitted,
      onboardingStatus,
      needsMoreInfo,
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