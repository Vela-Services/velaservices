import admin from "firebase-admin";
import serviceAccount from "../../velaservices-803f9-firebase-adminsdk-fbsvc-8fa012d1da.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminDb = admin.firestore();
