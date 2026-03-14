import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

/** Verify the Bearer token in the request and confirm the caller is an admin. */
async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) throw new Error("Unauthorized");
  const decoded = await adminAuth.verifyIdToken(token);
  if (!decoded.admin) throw new Error("Forbidden");
  return decoded;
}

/**
 * GET /api/admin/users
 * Returns the full list of Firebase Auth users (max 1,000).
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { users } = await adminAuth.listUsers(1000);
    const list = users.map((u) => ({
      uid: u.uid,
      email: u.email ?? "",
      displayName: u.displayName ?? "",
      emailVerified: u.emailVerified,
      disabled: u.disabled,
      createdAt: u.metadata.creationTime,
      lastSignIn: u.metadata.lastSignInTime,
      admin: !!(u.customClaims as Record<string, unknown> | undefined)?.admin,
    }));
    return NextResponse.json({ users: list });
  } catch (err) {
    const msg = String(err);
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Forbidden") ? 403 : msg.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Body: { uid: string }
 * Deletes the specified user. Admins cannot delete themselves.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await requireAdmin(req);
    const { uid } = await req.json() as { uid: string };
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });
    if (uid === caller.uid) {
      return NextResponse.json({ error: "Admins cannot delete their own account." }, { status: 400 });
    }
    await adminAuth.deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = String(err);
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Forbidden") ? 403 : msg.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
