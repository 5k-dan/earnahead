"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/orchids/map", label: "Discover" },
  { href: "/orchids/listings", label: "Listings" },
  { href: "/orchids/impact", label: "Impact" },
  { href: "/orchids/stories", label: "Stories" },
  { href: "/orchids/dashboard", label: "Dashboard" },
];

function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/orchids");
  };

  // Get initials from display name or email
  const initials = user?.displayName
    ? user.displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
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
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} style={{
                padding: "8px 16px",
                fontSize: 14,
                color: active ? "white" : "rgba(255,255,255,0.6)",
                textDecoration: "none",
                borderRadius: 6,
                borderBottom: active ? "2px solid var(--blue)" : "2px solid transparent",
                transition: "color 150ms ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = active ? "white" : "rgba(255,255,255,0.6)")}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user ? (
            <>
              {/* Avatar bubble */}
              <Link href="/orchids/dashboard" style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "rgba(255,255,255,0.75)",
                fontSize: 14,
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.displayName || user.email}
                </span>
              </Link>
              {isAdmin && (
                <Link href="/orchids/admin" style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--blue)",
                  background: "rgba(30,90,168,0.15)",
                  textDecoration: "none",
                  borderRadius: 6,
                  border: "1px solid rgba(30,90,168,0.3)",
                }}>
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/orchids/auth" style={{
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--blue)",
              textDecoration: "none",
              borderRadius: 8,
              transition: "opacity 150ms ease",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Log In
            </Link>
          )}
          <Link href="/" style={{
            padding: "8px 12px",
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}>
            ← Picker
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function OrchidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="orchids-theme">
        <NavBar />
        {children}
      </div>
    </AuthProvider>
  );
}
