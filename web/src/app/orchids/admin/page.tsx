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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusOk, setStatusOk] = useState(true);

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
      setStatusOk(false);
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user && isAdmin) fetchUsers();
  }, [loading, user, isAdmin, fetchUsers]);

  const showStatus = (msg: string, ok = true) => {
    setStatusMsg(msg);
    setStatusOk(ok);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const handleDelete = async (uid: string) => {
    setActionLoading(uid);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.uid !== uid));
        showStatus("User deleted.");
      } else {
        showStatus(data.error ?? "Delete failed.", false);
      }
    } catch {
      showStatus("Delete failed.", false);
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handlePatch = async (uid: string, action: string, optimistic: (u: UserRow) => UserRow) => {
    setActionLoading(uid + action);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uid, action }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.uid === uid ? optimistic(u) : u)));
        showStatus("Updated.");
      } else {
        showStatus(data.error ?? "Action failed.", false);
      }
    } catch {
      showStatus("Action failed.", false);
    } finally {
      setActionLoading(null);
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
          <div style={{ background: statusOk ? "#eafaf1" : "#fdecea", border: `1px solid ${statusOk ? "#52be80" : "#e74c3c"}40`, borderRadius: 8, padding: "10px 16px", fontSize: 13, color: statusOk ? "#1e8449" : "#c0392b", marginBottom: 24 }}>
            {statusMsg}
          </div>
        )}

        {/* Table */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 220px", padding: "12px 20px", background: "var(--off-white)", borderBottom: "1px solid var(--border)" }}>
            {["Name", "Email", "Verified", "Role", "Joined", "Last Sign In", "Actions"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</div>
            ))}
          </div>

          {fetching && users.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Loading users…</div>
          ) : users.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No users found.</div>
          ) : (
            users.map((u, i) => (
              <div key={u.uid} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 220px", padding: "16px 20px", borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center", background: u.disabled ? "rgba(0,0,0,0.02)" : u.admin ? "rgba(30,90,168,0.03)" : "white", opacity: u.disabled ? 0.6 : 1 }}>
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

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {/* Promote / demote admin */}
                  {u.uid !== user.uid && (
                    <button
                      onClick={() => handlePatch(u.uid, u.admin ? "removeAdmin" : "setAdmin", (row) => ({ ...row, admin: !row.admin }))}
                      disabled={!!actionLoading}
                      style={{ padding: "4px 10px", background: u.admin ? "var(--off-white)" : "rgba(30,90,168,0.1)", color: u.admin ? "var(--text-muted)" : "var(--blue)", border: `1px solid ${u.admin ? "var(--border)" : "rgba(30,90,168,0.3)"}`, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {actionLoading === u.uid + (u.admin ? "removeAdmin" : "setAdmin") ? "…" : u.admin ? "Demote" : "Make Admin"}
                    </button>
                  )}

                  {/* Disable / enable */}
                  {u.uid !== user.uid && (
                    <button
                      onClick={() => handlePatch(u.uid, u.disabled ? "enable" : "disable", (row) => ({ ...row, disabled: !row.disabled }))}
                      disabled={!!actionLoading}
                      style={{ padding: "4px 10px", background: u.disabled ? "#eafaf1" : "#fef9e7", color: u.disabled ? "#1e8449" : "#d68910", border: `1px solid ${u.disabled ? "#52be8040" : "#d6891040"}`, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      {actionLoading === u.uid + (u.disabled ? "enable" : "disable") ? "…" : u.disabled ? "Enable" : "Suspend"}
                    </button>
                  )}

                  {/* Delete */}
                  {u.uid !== user.uid && (
                    deleteConfirm === u.uid ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => handleDelete(u.uid)} disabled={!!actionLoading} style={{ padding: "4px 8px", background: "#c0392b", color: "white", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: "4px 8px", background: "var(--off-white)", color: "var(--navy)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(u.uid)} style={{ padding: "4px 10px", background: "transparent", color: "#c0392b", border: "1px solid #f1948a", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        Delete
                      </button>
                    )
                  )}

                  {u.uid === user.uid && (
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>you</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
