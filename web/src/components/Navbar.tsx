"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import { MapPin, ShoppingCart, User2 } from "lucide-react";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { plan } = useContext(CartContext);

  const cartCount = useMemo(() => plan.length, [plan.length]);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10,9,18,0.55)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", padding: "14px 0" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(168,85,247,0.95), rgba(236,72,153,0.85))",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              E
            </div>
            <div style={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
              Earn<span style={{ color: "rgba(168,85,247,0.95)" }}>Ahead</span>
            </div>
          </Link>

          <div style={{ flex: 1 }} />

          <div className="badge" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}>
            <MapPin size={16} />
            Atlanta, GA
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 14 }}>
            <Link className="btn" href="/cart" style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
              <ShoppingCart size={18} />
              <span style={{ fontSize: 14 }}>Plan</span>
              <span
                style={{
                  marginLeft: 2,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(168,85,247,0.18)",
                  border: "1px solid rgba(168,85,247,0.22)",
                  fontSize: 12,
                }}
              >
                {cartCount}
              </span>
            </Link>

            <Link className="btn" href="/profile" style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
              <User2 size={18} />
              <span style={{ fontSize: 14 }}>{user?.email ?? "Profile"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}