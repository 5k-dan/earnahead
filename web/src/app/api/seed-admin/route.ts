import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = "admin@vitalink.co";
const ADMIN_PASSWORD = "e@rnAhead";
const ADMIN_NAME = "Vitalink Admin";

/**
 * POST /api/seed-admin
 * Creates the admin@vitalink.co account if it doesn't exist,
 * sets the admin custom claim, and writes a Firestore profile.
 * Safe to call multiple times — idempotent.
 */
export async function POST() {
  try {
    let uid: string;

    try {
      // Try to fetch existing user
      const existing = await adminAuth.getUserByEmail(ADMIN_EMAIL);
      uid = existing.uid;
    } catch {
      // User doesn't exist — create them
      const newUser = await adminAuth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
        emailVerified: true, // admin account is pre-verified
      });
      uid = newUser.uid;
    }

    // Set admin custom claim (idempotent)
    await adminAuth.setCustomUserClaims(uid, { admin: true });

    // Write/overwrite Firestore profile
    await adminDb.collection("users").doc(uid).set({
      displayName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: "admin",
      createdAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true, uid });
  } catch (err) {
    console.error("seed-admin error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
