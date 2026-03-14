"use client";

import Link from "next/link";

export default function SixLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="six-theme" style={{ minHeight: "100vh" }}>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 52px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 17,
          color: "var(--text)",
          letterSpacing: "0.02em",
          fontWeight: 400,
        }}>
          EarnAhead
        </span>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-3)", cursor: "default" }}>Opportunities</span>
          <span style={{ fontSize: 12, color: "var(--text-3)", cursor: "default" }}>How It Works</span>
          <span style={{ fontSize: 12, color: "var(--text-3)", cursor: "default" }}>Impact</span>
          <Link href="/" style={{
            fontSize: 11,
            color: "var(--text-3)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}>
            ← Picker
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
