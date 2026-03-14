"use client";

import Link from "next/link";

const designs = [
  {
    href: "/figma",
    label: "Figma Professional",
    description: "Clean, professional healthcare platform with polished UI and animations.",
    accent: "#2E5C8A",
    tag: "Figma",
  },
  {
    href: "/figma/concept",
    label: "Figma Experimental",
    description: "Bold editorial layout with gradients, floating cards, and full-screen hero.",
    accent: "#6B8E7F",
    tag: "Figma · Concept",
  },
  {
    href: "/orchids",
    label: "Orchids",
    description: "Dark navy, serif-driven design — refined and data-focused.",
    accent: "#1d5fa8",
    tag: "Orchids",
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
          Three design directions for the same platform. Pick one to explore.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          width: "100%",
          maxWidth: 960,
        }}
      >
        {designs.map((d) => (
          <Link key={d.href} href={d.href} style={{ textDecoration: "none" }}>
            <div
              className="surface"
              style={{
                padding: 28,
                cursor: "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                borderTop: `3px solid ${d.accent}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: d.accent,
                  marginBottom: 12,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: `${d.accent}18`,
                }}
              >
                {d.tag}
              </div>
              <div className="h2" style={{ marginBottom: 10, color: "var(--text)" }}>
                {d.label}
              </div>
              <p className="kicker">{d.description}</p>
              <div
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  color: d.accent,
                }}
              >
                View design →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/login" style={{ fontSize: 13, color: "var(--muted2)" }}>
        Go to app →
      </Link>
    </div>
  );
}
