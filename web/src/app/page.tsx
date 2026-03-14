"use client";

import Link from "next/link";

// Order deliberately mixed — not labeled so viewers can't tell which is which
const designs: { num: string; href: string; accent: string; disabled?: boolean }[] = [
  { num: "1", href: "/orchids", accent: "#1d5fa8" },
  { num: "2", href: "/dashboard", accent: "#a855f7" },
  { num: "3", href: "/figma", accent: "#2E5C8A" },
  { num: "4", href: "/figma/concept", accent: "#6B8E7F" },
  { num: "5", href: "/combined", accent: "#C8861A" },
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
          Five design directions. Pick one to explore.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          width: "100%",
          maxWidth: 900,
          justifyContent: "center",
        }}
      >
        {designs.map((d) => {
          const card = (
            <div
              className="surface"
              style={{
                width: 140,
                height: 140,
                cursor: d.disabled ? "default" : "pointer",
                transition: "transform 0.15s ease",
                borderTop: `3px solid ${d.accent}`,
                opacity: d.disabled ? 0.45 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
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
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: `${d.accent}20`,
                  border: `1.5px solid ${d.accent}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                  color: d.accent,
                }}
              >
                {d.num}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: d.disabled ? "rgba(255,255,255,0.3)" : d.accent, letterSpacing: "0.04em" }}>
                {d.disabled ? "SOON" : "VIEW →"}
              </div>
            </div>
          );

          return d.disabled ? (
            <div key={d.num}>{card}</div>
          ) : (
            <Link key={d.num} href={d.href} style={{ textDecoration: "none" }}>{card}</Link>
          );
        })}
      </div>
    </div>
  );
}
