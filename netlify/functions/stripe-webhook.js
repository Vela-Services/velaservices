const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_PROD);
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

// Init Firebase (adapte avec tes creds ; assume firebase.ts exporte config)
const firebaseConfig = {
  // Colle ta config Firebase ici (apiKey, authDomain, etc.) ou importe si possible
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ... autres
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const sig = event.headers['stripe-signature'];
    const body = event.body;  // Raw body pour Netlify

    let stripeEvent;
    try {
      stripeEvent = Stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Signature failed:', err.message);
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid signature' }) };
    }

    switch (stripeEvent.type) {
      case 'account.updated':
        await handleAccountUpdated(stripeEvent.data.object);
        break;
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', stripeEvent.data.object);
        // Ajoute update DB pour mission payée si besoin
        break;
      case 'transfer.created':
        await handleTransferCreated(stripeEvent.data.object);
        break;
      default:
        console.log('Unhandled:', stripeEvent.type);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
  }
};

async function handleAccountUpdated(account) {
  const providerId = account.metadata?.providerId;
  if (!providerId) return;

  const needsMoreInfo =
    Array.isArray(account.requirements?.currently_due) &&
    account.requirements.currently_due.length > 0;
  const chargesEnabled = account.charges_enabled;
  const payoutsEnabled = account.payouts_enabled;
  
  // Determine onboarding status based on Stripe account state
  const status = needsMoreInfo
    ? 'incomplete'
    : chargesEnabled
    ? 'active'
    : 'pending';

  try {
    // Update users collection (not providers collection)
    await updateDoc(doc(db, 'users', providerId), {
      stripeOnboardingStatus: status,
      stripeChargesEnabled: chargesEnabled,
      stripePayoutsEnabled: payoutsEnabled,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.error('DB update failed:', err);
  }
}

async function handleTransferCreated(transfer) {
  const missionId = transfer.metadata?.missionId;
  if (!missionId) return;

  try {
    await updateDoc(doc(db, 'missions', missionId), {
      transferId: transfer.id,
      transferStatus: 'completed',
      transferredAt: new Date(),
    });
  } catch (err) {
    console.error('DB update failed:', err);
  }
}