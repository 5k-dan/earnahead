"use client";

import Link from "next/link";

const designs = [
  {
    num: "1",
    href: "/figma",
    description: "Clean professional layout with polished cards and animations.",
    accent: "#2E5C8A",
  },
  {
    num: "2",
    href: "/figma/concept",
    description: "Bold editorial hero, asymmetric grids, floating map cards.",
    accent: "#6B8E7F",
  },
  {
    num: "3",
    href: "/orchids",
    description: "Dark navy, serif-driven — refined and data-focused.",
    accent: "#1d5fa8",
  },
  {
    num: "4",
    href: "/dashboard",
    description: "The original working app with Firebase auth and live data.",
    accent: "#a855f7",
  },
  {
    num: "5",
    href: "/combined",
    description: "Best of all designs — coming soon.",
    accent: "#ec4899",
    disabled: true,
  },
];

export default function DesignPicker() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: 48,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="badge" style={{ marginBottom: 16, display: "inline-flex" }}>
          EarnAhead Design Preview
        </div>
        <div className="h1" style={{ fontSize: 48, marginTop: 0 }}>
          Choose a UI
        </div>
        <p className="sub" style={{ maxWidth: 480, margin: "8px auto 0" }}>
          Five design directions for the same platform. Pick one to explore.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
          width: "100%",
          maxWidth: 1100,
        }}
      >
        {designs.map((d) => {
          const card = (
            <div
              className="surface"
              style={{
                padding: "28px 20px",
                cursor: d.disabled ? "default" : "pointer",
                transition: "transform 0.15s ease",
                borderTop: `3px solid ${d.accent}`,
                opacity: d.disabled ? 0.5 : 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                if (!d.disabled) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `${d.accent}20`,
                  border: `1.5px solid ${d.accent}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: d.accent,
                  marginBottom: 16,
                }}
              >
                {d.num}
              </div>
              <p className="kicker" style={{ flex: 1, marginBottom: 20 }}>{d.description}</p>
              <div style={{ fontSize: 12, fontWeight: 600, color: d.accent }}>
                {d.disabled ? "Coming soon" : "View →"}
              </div>
            </div>
          );

          return d.disabled ? (
            <div key={d.num} style={{ textDecoration: "none" }}>{card}</div>
          ) : (
            <Link key={d.num} href={d.href} style={{ textDecoration: "none" }}>{card}</Link>
          );
        })}
      </div>
    </div>
  );
}
