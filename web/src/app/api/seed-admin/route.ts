import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = "admin@vitalink.co";
const ADMIN_NAME = "Vitalink Admin";
// Password is set via env — never hardcoded
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD;

async function seed() {
  if (!ADMIN_PASSWORD) throw new Error("ADMIN_SEED_PASSWORD is not set in .env.local");
  let uid: string;
  try {
    const existing = await adminAuth.getUserByEmail(ADMIN_EMAIL);
    uid = existing.uid;
  } catch {
    const newUser = await adminAuth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
      emailVerified: true,
    });
    uid = newUser.uid;
  }
  await adminAuth.setCustomUserClaims(uid, { admin: true });
  await adminDb.collection("users").doc(uid).set({
    displayName: ADMIN_NAME,
    email: ADMIN_EMAIL,
    role: "admin",
    createdAt: new Date().toISOString(),
  }, { merge: true });
  return uid;
}

/** GET /api/seed-admin — visit in browser to run setup */
export async function GET() {
  try {
    const uid = await seed();
    return NextResponse.json({ success: true, uid, message: "Admin account ready. You can now sign in at /orchids/auth." });
  } catch (err) {
    console.error("seed-admin error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** POST /api/seed-admin — same thing, callable via curl */
export async function POST() {
  try {
    const uid = await seed();
    return NextResponse.json({ success: true, uid });
  } catch (err) {
    console.error("seed-admin error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
