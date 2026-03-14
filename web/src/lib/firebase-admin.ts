import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env.local"
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
