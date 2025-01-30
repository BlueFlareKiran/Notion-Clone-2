import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

// Safely load the service account key from environment variables
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
  ? JSON.parse(
      Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64,
        "base64"
      ).toString("utf-8")
    )
  : null;

if (!serviceAccount) {
  throw new Error("Missing Firebase service account configuration");
}

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };