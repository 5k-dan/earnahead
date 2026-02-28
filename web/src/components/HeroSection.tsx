"use client";

import { Sparkles } from "lucide-react";

export default function HeroSection({ weeklyPotential }: { weeklyPotential: number }) {
  return (
    <div style={{ padding: "30px 0 18px" }}>
      <div className="container">
        <div className="surface" style={{ padding: 26, overflow: "hidden", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -2,
              background:
                "radial-gradient(700px 220px at 20% 20%, rgba(168,85,247,0.25), transparent 60%), radial-gradient(700px 220px at 70% 20%, rgba(236,72,153,0.18), transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div className="badge">
              <Sparkles size={16} />
              Your area is hot right now
            </div>

            <div className="h1" style={{ marginTop: 16 }}>
              Earn up to{" "}
              <span style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", color: "transparent" }}>
                ${weeklyPotential || 320}
              </span>{" "}
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>/week</span>
            </div>

            <div className="sub" style={{ maxWidth: 650 }}>
              Discover flexible, regulated income opportunities near you. Add them to your plan and track what you can earn.
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              <a className="btn btnPrimary" href="#opps" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                Find Opportunities <span style={{ opacity: 0.9 }}>→</span>
              </a>
              <a className="btn" href="/cart">
                View Plan
              </a>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 16, color: "rgba(255,255,255,0.55)", fontSize: 13, flexWrap: "wrap" }}>
              <span>✓ Verified listings</span>
              <span>•</span>
              <span>No fees</span>
              <span>•</span>
              <span>100% legit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}