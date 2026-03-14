import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = "dandmin@vitalink.co";
const ADMIN_NAME = "Vitalink Admin";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD;

const TEST_EMAIL = "test@user.co";
const TEST_NAME = "Test User";
const TEST_PASSWORD = process.env.TEST_SEED_PASSWORD;

async function seedAdmin() {
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

async function seedTestUser() {
  if (!TEST_PASSWORD) throw new Error("TEST_SEED_PASSWORD is not set in .env.local");
  let uid: string;
  try {
    const existing = await adminAuth.getUserByEmail(TEST_EMAIL);
    uid = existing.uid;
  } catch {
    const newUser = await adminAuth.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      displayName: TEST_NAME,
      emailVerified: true, // pre-verified — no email confirmation needed
    });
    uid = newUser.uid;
  }
  await adminDb.collection("users").doc(uid).set({
    displayName: TEST_NAME,
    email: TEST_EMAIL,
    role: "user",
    createdAt: new Date().toISOString(),
  }, { merge: true });
  return uid;
}

async function seed() {
  const adminUid = await seedAdmin();
  const testUid = await seedTestUser();
  return { adminUid, testUid };
}

/** GET /api/seed-admin — visit in browser to run setup */
export async function GET() {
  try {
    const { adminUid, testUid } = await seed();
    return NextResponse.json({
      success: true,
      adminUid,
      testUid,
      message: "Accounts ready. Sign in at /orchids/auth.",
    });
  } catch (err) {
    console.error("seed-admin error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** POST /api/seed-admin — callable via curl */
export async function POST() {
  try {
    const { adminUid, testUid } = await seed();
    return NextResponse.json({ success: true, adminUid, testUid });
  } catch (err) {
    console.error("seed-admin error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
