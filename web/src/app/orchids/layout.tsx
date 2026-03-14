import React from "react";
import Link from "next/link";

export default function OrchidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="orchids-theme">
      {/* Nav */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--navy)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/orchids" style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 20,
            color: "white",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}>
            Vitalink
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              { href: "/orchids/map", label: "Discover" },
              { href: "/orchids/listings", label: "Listings" },
              { href: "/orchids/impact", label: "Impact" },
              { href: "/orchids/stories", label: "Stories" },
              { href: "/orchids/dashboard", label: "Dashboard" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                padding: "8px 16px",
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                borderRadius: 6,
                transition: "color 150ms ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {label}
              </Link>
            ))}
          </div>

          <Link href="/" style={{
            padding: "8px 16px",
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
          }}>
            ← Picker
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
}
