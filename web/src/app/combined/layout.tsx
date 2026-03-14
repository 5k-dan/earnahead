"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/combined/map", label: "Discover" },
  { href: "/combined/impact", label: "Impact" },
  { href: "/combined/stories", label: "Stories" },
  { href: "/combined/dashboard", label: "Dashboard" },
];

export default function CombinedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="combined-theme" style={{ minHeight: "100vh" }}>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 48px",
        background: "rgba(6, 13, 24, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/combined" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: "var(--accent)",
              letterSpacing: "0.06em",
              fontWeight: 400,
            }}>
              LUMEN
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {nav.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: "8px 20px",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: active ? "var(--white)" : "var(--text-2)",
                    textDecoration: "none",
                    transition: "color 150ms",
                    borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-2)";
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/combined/map" style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              Get Started →
            </Link>
            <Link href="/" style={{
              fontSize: 12,
              color: "var(--text-3)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}>
              ← Picker
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
