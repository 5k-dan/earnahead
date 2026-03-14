"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type UserRow = {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  disabled: boolean;
  createdAt: string;
  lastSignIn: string;
  admin: boolean;
};

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [fetching, setFetching] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Guard: must be signed in + admin
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/orchids/auth");
    else if (!isAdmin) router.replace("/orchids");
  }, [user, loading, isAdmin, router]);

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      setStatusMsg("Failed to load users.");
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user && isAdmin) fetchUsers();
  }, [loading, user, isAdmin, fetchUsers]);

  const handleDelete = async (uid: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.uid !== uid));
        setStatusMsg("User deleted.");
      } else {
        setStatusMsg(data.error ?? "Delete failed.");
      }
    } catch {
      setStatusMsg("Delete failed.");
    } finally {
      setDeleteConfirm(null);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--off-white)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--blue)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "32px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 6 }}>
              Admin Console
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--navy)", margin: 0, letterSpacing: "-0.02em" }}>
              User Management
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{users.length} accounts</span>
            <button
              onClick={fetchUsers}
              disabled={fetching}
              style={{ padding: "8px 18px", background: "var(--navy)", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: fetching ? "not-allowed" : "pointer", opacity: fetching ? 0.6 : 1 }}
            >
              {fetching ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px" }}>
        {/* Status message */}
        {statusMsg && (
          <div style={{ background: statusMsg.includes("deleted") || statusMsg.includes("Deleted") ? "#eafaf1" : "#fdecea", border: `1px solid ${statusMsg.includes("deleted") || statusMsg.includes("Deleted") ? "#52be80" : "#e74c3c"}40`, borderRadius: 8, padding: "10px 16px", fontSize: 13, color: statusMsg.includes("deleted") || statusMsg.includes("Deleted") ? "#1e8449" : "#c0392b", marginBottom: 24 }}>
            {statusMsg}
          </div>
        )}

        {/* Table */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 80px", padding: "12px 20px", background: "var(--off-white)", borderBottom: "1px solid var(--border)" }}>
            {["Name", "Email", "Verified", "Role", "Joined", "Last Sign In", ""].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</div>
            ))}
          </div>

          {fetching && users.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Loading users…</div>
          ) : users.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No users found.</div>
          ) : (
            users.map((u, i) => (
              <div key={u.uid} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 80px", padding: "16px 20px", borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center", background: u.admin ? "rgba(30,90,168,0.03)" : "white" }}>
                {/* Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: u.admin ? "var(--blue)" : "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {(u.displayName || u.email)[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>{u.displayName || "—"}</span>
                </div>

                {/* Email */}
                <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>

                {/* Verified */}
                <div>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: u.emailVerified ? "#eafaf1" : "#fef9e7", color: u.emailVerified ? "#1e8449" : "#d68910" }}>
                    {u.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* Role */}
                <div>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: u.admin ? "rgba(30,90,168,0.12)" : "var(--off-white)", color: u.admin ? "var(--blue)" : "var(--text-muted)" }}>
                    {u.admin ? "Admin" : "User"}
                  </span>
                </div>

                {/* Joined */}
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmtDate(u.createdAt)}</div>

                {/* Last sign in */}
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmtDate(u.lastSignIn)}</div>

                {/* Delete */}
                <div>
                  {u.admin ? (
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>—</span>
                  ) : deleteConfirm === u.uid ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleDelete(u.uid)} style={{ padding: "4px 10px", background: "#c0392b", color: "white", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Yes</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: "4px 10px", background: "var(--off-white)", color: "var(--navy)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(u.uid)} style={{ padding: "4px 12px", background: "transparent", color: "#c0392b", border: "1px solid #f1948a", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Seed reminder */}
        <div style={{ marginTop: 24, padding: "14px 20px", background: "rgba(30,90,168,0.06)", border: "1px solid rgba(30,90,168,0.15)", borderRadius: 8, fontSize: 13, color: "var(--navy)" }}>
          <strong>Admin account setup:</strong> If the admin@vitalink.co account hasn&apos;t been created yet, call{" "}
          <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: 3 }}>POST /api/seed-admin</code> once to initialize it.
        </div>
      </div>
    </div>
  );
}
