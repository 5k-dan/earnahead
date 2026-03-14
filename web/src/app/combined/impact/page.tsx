"use client";

import { useRef, useEffect, useState } from "react";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return inView;
}

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
      else setValue(target);
    };
    requestAnimationFrame(frame);
  }, [active]);
  return value;
}

const cityData = [
  { city: "Chicago, IL", donors: 3840, patients: 7120, earned: 521000, bar: 100 },
  { city: "Austin, TX", donors: 2960, patients: 5480, earned: 401000, bar: 76 },
  { city: "Philadelphia, PA", donors: 2710, patients: 5020, earned: 367000, bar: 71 },
  { city: "Boston, MA", donors: 2180, patients: 4040, earned: 295000, bar: 57 },
  { city: "Seattle, WA", donors: 1940, patients: 3600, earned: 263000, bar: 51 },
  { city: "Denver, CO", donors: 1630, patients: 3020, earned: 221000, bar: 43 },
  { city: "Portland, OR", donors: 1210, patients: 2240, earned: 164000, bar: 32 },
  { city: "Nashville, TN", donors: 980, patients: 1820, earned: 133000, bar: 25 },
];

const breakdown = [
  { type: "Plasma", pct: 48, color: "#C8861A", count: "68,400" },
  { type: "Blood", pct: 31, color: "#9B3333", count: "44,100" },
  { type: "Research", pct: 12, color: "#2A5BA8", count: "17,100" },
  { type: "Sperm", pct: 5, color: "#6B4A9B", count: "7,100" },
  { type: "Egg", pct: 4, color: "#2D7A5A", count: "5,700" },
];

const monthlyData = [28000, 34000, 29000, 38000, 42000, 40000, 46000, 51000, 48000, 58000, 54000, 62000];
const monthLabels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const maxVal = Math.max(...monthlyData);

function BarChart({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 160 }}>
      {monthlyData.map((val, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 9, color: "var(--text-3)", fontWeight: 600 }}>
            {active ? `${(val / 1000).toFixed(0)}k` : ""}
          </div>
          <div style={{
            width: "100%",
            height: active ? `${(val / maxVal) * 120}px` : "4px",
            background: i === monthlyData.length - 1 ? "var(--accent)" : "var(--surface-3)",
            transition: `height ${500 + i * 60}ms cubic-bezier(0.34,1.56,0.64,1)`,
            flexShrink: 0,
          }} />
          <div style={{ fontSize: 9, color: i === monthlyData.length - 1 ? "var(--accent)" : "var(--text-3)", fontWeight: i === monthlyData.length - 1 ? 700 : 400 }}>
            {monthLabels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  const total = breakdown.reduce((s, d) => s + d.pct, 0);
  const circumference = 2 * Math.PI * 64;
  let offset = 0;
  const arcs = breakdown.map((d) => {
    const dashArray = (d.pct / total) * circumference;
    const dashOffset = circumference - (offset / total) * circumference;
    offset += d.pct;
    return { dashArray: dashArray - 2, dashRest: circumference - dashArray + 2, dashOffset, color: d.color };
  });

  return (
    <svg viewBox="0 0 180 180" style={{ width: "100%", maxWidth: 240, display: "block" }}>
      {arcs.map((arc, i) => (
        <circle key={i} cx="90" cy="90" r="64" fill="none"
          stroke={arc.color} strokeWidth="24"
          strokeDasharray={`${arc.dashArray} ${arc.dashRest}`}
          strokeDashoffset={arc.dashOffset}
        />
      ))}
      <circle cx="90" cy="90" r="52" fill="var(--surface)" />
      <text x="90" y="84" textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: "var(--white)", fontFamily: "'DM Serif Display', serif" }}>142k</text>
      <text x="90" y="100" textAnchor="middle" style={{ fontSize: 9, fill: "var(--text-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>donations</text>
    </svg>
  );
}

function StatBox({ value, prefix = "", suffix = "", label, active, size = 48 }: {
  value: number; prefix?: string; suffix?: string; label: string; active: boolean; size?: number;
}) {
  const n = useCountUp(value, active);
  return (
    <div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: size, color: "var(--white)", lineHeight: 1, marginBottom: 8 }}>
        {prefix}{n >= 1000 ? n.toLocaleString() : n}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-2)" }}>{label}</div>
    </div>
  );
}

export default function CombinedImpact() {
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const statsActive = useInView(statsRef as React.RefObject<HTMLElement>);
  const chartActive = useInView(chartRef as React.RefObject<HTMLElement>);

  return (
    <div style={{ background: "var(--bg)", paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "80px 48px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 20 }}>
            Community Impact
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(40px, 4.5vw, 60px)",
                color: "var(--white)", letterSpacing: "-0.025em", lineHeight: 1.05,
                margin: "0 0 20px",
              }}>
                The cumulative power<br />
                <em style={{ fontStyle: "italic", color: "var(--accent)" }}>of community health.</em>
              </h1>
              <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.8, maxWidth: 480, margin: 0 }}>
                Every contribution through Lumen becomes part of a national network of health impact.
                These are the numbers that matter.
              </p>
            </div>
            <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                { value: 142300, suffix: "+", label: "Total contributions nationwide" },
                { value: 89000, suffix: "+", label: "Patients directly helped" },
                { value: 4200000, prefix: "$", label: "Paid to contributors", size: 40 },
                { value: 2400, suffix: "+", label: "Verified partner centers" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "28px",
                  borderTop: i > 1 ? "1px solid var(--border)" : "none",
                  borderLeft: (i === 1 || i === 3) ? "1px solid var(--border)" : "none",
                }}>
                  <StatBox {...s} active={statsActive} size={s.size || 44} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div ref={chartRef} style={{ padding: "80px 48px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16 }}>
                Volume trend
              </div>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                color: "var(--white)", letterSpacing: "-0.02em", margin: "0 0 20px",
              }}>
                12-month donation volume.
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, margin: "0 0 32px" }}>
                Consistent growth driven by platform expansion into new metropolitan areas and increased awareness of compensation opportunities.
              </p>
              <div style={{ display: "flex", gap: 32 }}>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "var(--accent)", lineHeight: 1 }}>478k</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>Total this period</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#4ADE80", lineHeight: 1 }}>+24%</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>YoY growth</div>
                </div>
              </div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "32px" }}>
              <BarChart active={chartActive} />
            </div>
          </div>
        </div>
      </div>

      {/* Contribution breakdown */}
      <div style={{ padding: "80px 48px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 20 }}>
              Contribution types
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              color: "var(--white)", letterSpacing: "-0.02em", margin: "0 0 40px",
            }}>
              How our community contributes.
            </h2>
            {breakdown.map((item) => (
              <div key={item.type} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--white)" }}>{item.type}</span>
                  <span style={{ fontSize: 12, color: "var(--text-2)" }}>{item.count} · {item.pct}%</span>
                </div>
                <div style={{ height: 4, background: "var(--surface-2)" }}>
                  <div style={{ height: "100%", width: `${item.pct * 2}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DonutChart />
          </div>
        </div>
      </div>

      {/* City leaderboard */}
      <div style={{ padding: "80px 48px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16 }}>
              City leaders
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              color: "var(--white)", letterSpacing: "-0.02em", margin: 0,
            }}>
              Leading communities by contribution.
            </h2>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 140px 140px 160px",
              padding: "14px 28px",
              background: "var(--surface-2)",
              borderBottom: "1px solid var(--border)",
              fontSize: 10, color: "var(--text-3)", textTransform: "uppercase",
              letterSpacing: "0.08em", fontWeight: 600,
            }}>
              <span>City</span><span>Active donors</span><span>Patients helped</span><span>Total paid out</span>
            </div>
            {cityData.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "2fr 140px 140px 160px",
                padding: "20px 28px",
                borderBottom: i < cityData.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--white)" }}>{c.city}</span>
                    {i === 0 && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "var(--accent)", padding: "2px 8px", border: "1px solid var(--accent)", letterSpacing: "0.06em" }}>
                        #1 CITY
                      </span>
                    )}
                  </div>
                  <div style={{ height: 2, background: "var(--surface-2)", width: "90%" }}>
                    <div style={{ height: "100%", width: `${c.bar}%`, background: "var(--accent)" }} />
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "var(--text)" }}>{c.donors.toLocaleString()}</span>
                <span style={{ fontSize: 14, color: "var(--text)" }}>{c.patients.toLocaleString()}</span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--accent)" }}>
                  ${(c.earned / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <blockquote style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(20px, 2.5vw, 30px)",
            color: "var(--white)", lineHeight: 1.5, fontStyle: "italic",
            margin: "0 0 24px",
          }}>
            "The patients who receive these donations often have no other options.
            What Lumen has done is create a sustainable, dignified pipeline of human generosity."
          </blockquote>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>Dr. Amara Osei — Hematology, Northwestern Medicine</div>
        </div>
      </div>
    </div>
  );
}
