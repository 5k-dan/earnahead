import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const snap = await adminDb.collection("users").doc(uid).get();

    if (!snap.exists) {
      return NextResponse.json({ state: null }, { status: 200 });
    }

    const data = snap.data();

    // RETURN THE ACTUAL STATE FIELD
    return NextResponse.json(
      { state: data?.state || null },
      { status: 200 }
    );
  } catch (err) {
    console.error("Profile API error:", err);
    return NextResponse.json({ state: null }, { status: 500 });
  }
}