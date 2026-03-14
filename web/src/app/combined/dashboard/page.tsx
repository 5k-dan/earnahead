"use client";

import { useState } from "react";
import Link from "next/link";

const weekEarnings = [0, 110, 110, 0, 110, 0, 0]; // Sun–Sat
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekGoal = 440;
const weekTotal = weekEarnings.reduce((a, b) => a + b, 0);

const recentContributions = [
  { date: "Mar 12", type: "Plasma", typeFull: "PLASMA", org: "BioLife — Clark St", comp: "+$110", duration: "87 min", status: "Completed" },
  { date: "Mar 10", type: "plasma", typeFull: "PLASMA", org: "BioLife — Clark St", comp: "+$110", duration: "91 min", status: "Completed" },
  { date: "Mar 7", type: "plasma", typeFull: "PLASMA", org: "BioLife — Clark St", comp: "+$110", duration: "84 min", status: "Completed" },
  { date: "Mar 5", type: "blood", typeFull: "BLOOD", org: "American Red Cross", comp: "+$50", duration: "48 min", status: "Completed" },
  { date: "Feb 28", type: "research", typeFull: "RESEARCH", org: "Northwestern Medicine", comp: "+$300", duration: "2h 14min", status: "Completed" },
];

const typeColors: Record<string, string> = {
  plasma: "#C8861A",
  blood: "#9B3333",
  research: "#2A5BA8",
  egg: "#2D7A5A",
  sperm: "#6B4A9B",
};

const monthlyData = [2800, 3200, 2950, 3800, 4100, 3750, 4400, 4850, 4600, 5200, 4900, 5560];
const monthLabels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const maxMonthly = Math.max(...monthlyData);

function EarningsSparkline() {
  const w = 520, h = 120;
  const pad = 8;
  const pts = monthlyData.map((v, i) => {
    const x = pad + (i / (monthlyData.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v / maxMonthly) * (h - pad * 2));
    return `${x},${y}`;
  });
  const areaPath = `M ${pts[0]} L ${pts.join(" L ")} L ${pad + (w - pad * 2)},${h} L ${pad},${h} Z`;
  const linePath = `M ${pts[0]} L ${pts.join(" L ")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 120, display: "block" }}>
      <defs>
        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8861A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C8861A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#earningsGrad)" />
      <path d={linePath} fill="none" stroke="#C8861A" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="4" fill="#C8861A" />
    </svg>
  );
}

export default function CombinedDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  const progressPct = Math.min((weekTotal / weekGoal) * 100, 100);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 48, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 12 }}>
              Dashboard
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 40, color: "var(--white)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1,
            }}>
              Good morning, Marcus.
            </h1>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {(["overview", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 20px", fontSize: 13, fontWeight: 500,
                  letterSpacing: "0.02em", cursor: "pointer", fontFamily: "inherit",
                  background: activeTab === tab ? "var(--surface)" : "transparent",
                  color: activeTab === tab ? "var(--white)" : "var(--text-2)",
                  border: "1px solid var(--border-2)",
                  borderLeft: tab === "history" ? "none" : "1px solid var(--border-2)",
                  transition: "all 150ms", textTransform: "capitalize",
                }}
              >{tab}</button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Top stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginBottom: 32 }}>
              {[
                { label: "Total earned", value: "$9,200", sub: "all time" },
                { label: "This month", value: "$440", sub: "of $440 goal", highlight: true },
                { label: "Sessions", value: "184", sub: "donations total" },
                { label: "Lives impacted", value: "~60", sub: "estimated patients" },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: "28px 32px",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderLeft: i > 0 ? "none" : "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)", marginBottom: 12 }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 38, color: stat.highlight ? "var(--accent)" : "var(--white)",
                    lineHeight: 1, marginBottom: 6,
                  }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Two-column: chart + week */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 32 }}>
              {/* Earnings chart */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)", marginBottom: 8 }}>
                      Earnings history
                    </div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "var(--white)", lineHeight: 1 }}>$9,200</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4ADE80", fontWeight: 600 }}>
                    ↑ 14% vs last year
                  </div>
                </div>
                <EarningsSparkline />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  {monthLabels.map((m, i) => (
                    <span key={i} style={{
                      fontSize: 10, color: i === monthLabels.length - 1 ? "var(--accent)" : "var(--text-3)",
                      fontWeight: i === monthLabels.length - 1 ? 700 : 400,
                    }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* This week */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "28px 28px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)", marginBottom: 20 }}>
                  This week
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>
                  ${weekTotal}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 24 }}>of ${weekGoal} goal</div>

                {/* Progress bar */}
                <div style={{ height: 4, background: "var(--surface-2)", marginBottom: 24 }}>
                  <div style={{
                    height: "100%", width: `${progressPct}%`,
                    background: "var(--accent)", transition: "width 800ms ease",
                  }} />
                </div>

                {/* Day bars */}
                <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 64, marginBottom: 12 }}>
                  {weekEarnings.map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div style={{
                          width: "100%",
                          height: v > 0 ? `${(v / 110) * 100}%` : "6px",
                          background: v > 0 ? "var(--accent)" : "var(--surface-2)",
                          minHeight: 6,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {weekDays.map((d, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--text-3)", fontWeight: 500 }}>{d}</div>
                  ))}
                </div>

                {/* Next appointment */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)", marginBottom: 12 }}>
                    Next appointment
                  </div>
                  <div style={{ fontSize: 14, color: "var(--white)", fontWeight: 600, marginBottom: 3 }}>BioLife — Clark St</div>
                  <div style={{ fontSize: 12, color: "var(--accent)" }}>Tomorrow, 10:00 AM</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Plasma · 90 min · $110</div>
                </div>
              </div>
            </div>

            {/* Lifetime impact */}
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", padding: "36px 40px", marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>
                    Lifetime impact
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--white)", margin: 0, letterSpacing: "-0.01em" }}>
                    Your contribution to community health.
                  </h3>
                </div>
                <Link href="/combined/impact" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600, letterSpacing: "0.03em" }}>
                  View full impact →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
                {[
                  { label: "Plasma sessions", value: "184", sub: "since Jan 2024" },
                  { label: "Blood donations", value: "8", sub: "every 56 days" },
                  { label: "Research studies", value: "3", sub: "completed" },
                  { label: "Patients helped", value: "~60", sub: "estimated" },
                  { label: "Total earned", value: "$9,200", sub: "direct compensation" },
                ].map((item, i) => (
                  <div key={i} style={{
                    paddingLeft: i > 0 ? 28 : 0,
                    borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                  }}>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--accent)", lineHeight: 1, marginBottom: 6 }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* History tab */}
        {activeTab === "history" && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "100px 140px 1fr 100px 80px 100px",
              padding: "14px 28px",
              background: "var(--surface-2)",
              borderBottom: "1px solid var(--border)",
              fontSize: 10, color: "var(--text-3)",
              textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
            }}>
              <span>Date</span>
              <span>Type</span>
              <span>Location</span>
              <span>Duration</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Earned</span>
            </div>
            {recentContributions.map((c, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "100px 140px 1fr 100px 80px 100px",
                padding: "18px 28px",
                borderBottom: "1px solid var(--border)",
                alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>{c.date}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                  color: typeColors[c.type] || "var(--accent)",
                  padding: "3px 8px", display: "inline-block",
                  border: `1px solid ${(typeColors[c.type] || "#C8861A") + "40"}`,
                  background: `${(typeColors[c.type] || "#C8861A")}14`,
                  width: "fit-content",
                }}>{c.typeFull}</span>
                <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{c.org}</span>
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>{c.duration}</span>
                <span style={{ fontSize: 12, color: "#4ADE80", fontWeight: 500 }}>✓ {c.status}</span>
                <span style={{ fontSize: 15, color: "var(--accent)", fontWeight: 600, textAlign: "right", fontFamily: "'DM Serif Display', serif" }}>
                  {c.comp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
