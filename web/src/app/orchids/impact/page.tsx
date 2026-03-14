"use client";

import { useRef, useEffect, useState } from "react";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return inView;
}

function useCountUp(target: number, active: boolean, duration = 1600) {
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
  { city: "Chicago, IL", donors: 3840, patients: 7120, earned: 521000, bar: 92 },
  { city: "Austin, TX", donors: 2960, patients: 5480, earned: 401000, bar: 72 },
  { city: "Philadelphia, PA", donors: 2710, patients: 5020, earned: 367000, bar: 66 },
  { city: "Boston, MA", donors: 2180, patients: 4040, earned: 295000, bar: 54 },
  { city: "Seattle, WA", donors: 1940, patients: 3600, earned: 263000, bar: 48 },
  { city: "Denver, CO", donors: 1630, patients: 3020, earned: 221000, bar: 40 },
  { city: "Portland, OR", donors: 1210, patients: 2240, earned: 164000, bar: 30 },
  { city: "Nashville, TN", donors: 980, patients: 1820, earned: 133000, bar: 24 },
];

const donationBreakdown = [
  { type: "Plasma", pct: 48, color: "var(--blue)", count: "68,400" },
  { type: "Blood", pct: 31, color: "#c0392b", count: "44,100" },
  { type: "Research", pct: 12, color: "var(--navy)", count: "17,100" },
  { type: "Sperm", pct: 5, color: "#5c3d8a", count: "7,100" },
  { type: "Egg", pct: 4, color: "var(--green)", count: "5,700" },
];

const monthlyTrend = [28000, 34000, 29000, 38000, 42000, 40000, 46000, 51000, 48000, 58000, 54000, 62000];
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const maxTrend = Math.max(...monthlyTrend);

function AnimatedNumber({ value, prefix = "", suffix = "", active }: { value: number; prefix?: string; suffix?: string; active: boolean }) {
  const num = useCountUp(value, active);
  return <>{prefix}{num >= 1000 ? num.toLocaleString() : num}{suffix}</>;
}

// SVG donut chart
function DonutChart() {
  const data = donationBreakdown;
  const total = data.reduce((s, d) => s + d.pct, 0);
  const circumference = 2 * Math.PI * 70;
  let offset = 0;
  const arcs = data.map(d => {
    const dashArray = (d.pct / total) * circumference;
    const dashOffset = circumference - (offset / total) * circumference;
    offset += d.pct;
    return { dashArray: dashArray - 2, dashRest: circumference - dashArray + 2, dashOffset, color: d.color };
  });

  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 320, margin: "0 auto", display: "block" }}>
      {arcs.map((arc, i) => (
        <circle key={i} cx="100" cy="100" r="70" fill="none" stroke={arc.color} strokeWidth="28"
          strokeDasharray={`${arc.dashArray} ${arc.dashRest}`} strokeDashoffset={arc.dashOffset} />
      ))}
      <circle cx="100" cy="100" r="56" fill="white" />
      <text x="100" y="95" textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: "var(--navy)", fontFamily: "'DM Serif Display', serif" }}>142k</text>
      <text x="100" y="115" textAnchor="middle" style={{ fontSize: 10, fill: "#718096" }}>donations</text>
    </svg>
  );
}

export default function OrchidsImpact() {
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const statsActive = useInView(statsRef as React.RefObject<HTMLElement>);
  const chartActive = useInView(chartRef as React.RefObject<HTMLElement>);

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--navy)", padding: "80px 32px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-light)", fontWeight: 600, marginBottom: 16 }}>
            Community Impact Report
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px, 5vw, 56px)", color: "white", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 20 }}>
            The cumulative power<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.65)" }}>of community health.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 540, margin: "0 auto" }}>
            Every contribution through Vitalink becomes part of a national network of health and human impact.
          </p>
        </div>
      </div>

      {/* Top stats */}
      <div ref={statsRef} style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {[
            { label: "Total donations nationwide", value: 142300, suffix: "+" },
            { label: "Patients helped", value: 89000, suffix: "+" },
            { label: "Paid to contributors", prefix: "$", value: 4200000, isLarge: true },
            { label: "Partner clinics & centers", value: 2400 },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none", paddingLeft: i > 0 ? 40 : 0 }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: s.isLarge ? 34 : 38, color: "var(--navy)", lineHeight: 1, marginBottom: 8 }}>
                <AnimatedNumber value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} active={statsActive} />
              </div>
              <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <div ref={chartRef} style={{ padding: "80px 32px", background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>Donation volume</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--navy)", letterSpacing: "-0.02em" }}>
              Monthly donations, 12-month view
            </h2>
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "32px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 200 }}>
              {monthlyTrend.map((val, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
                    {chartActive ? (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val) : ""}
                  </div>
                  <div style={{
                    width: "100%",
                    height: chartActive ? `${(val / maxTrend) * 140}px` : "4px",
                    background: i === monthlyTrend.length - 1 ? "var(--blue)" : "var(--gray-200)",
                    borderRadius: "4px 4px 0 0",
                    transition: `height ${600 + i * 50}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{months[i]}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 32, fontSize: 13, color: "var(--text-muted)" }}>
              <span>Total this period: <strong style={{ color: "var(--navy)" }}>478,000 donations</strong></span>
              <span>YoY growth: <strong style={{ color: "var(--green)" }}>+24%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Donation breakdown */}
      <div style={{ padding: "80px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>Contribution types</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--navy)", letterSpacing: "-0.02em", marginBottom: 16 }}>
              How our community contributes.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36 }}>
              Plasma donation represents nearly half of all contributions, providing critical treatments for patients with rare diseases.
            </p>
            {donationBreakdown.map((item, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>{item.type}</span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.count} donations · {item.pct}%</span>
                </div>
                <div style={{ height: 6, background: "var(--gray-100)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          <DonutChart />
        </div>
      </div>

      {/* City leaderboard */}
      <div style={{ padding: "80px 32px", background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>City leaders</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--navy)", letterSpacing: "-0.02em" }}>
              Leading communities by contribution.
            </h2>
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 140px 140px 160px 80px", padding: "14px 28px", background: "var(--off-white)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
              <span>City</span><span>Active donors</span><span>Patients helped</span><span>Total paid out</span><span>Index</span>
            </div>
            {cityData.map((city, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 140px 140px 160px 80px", padding: "18px 28px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{city.city}</span>
                    {i === 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#b8860b", background: "#fef9e7", padding: "2px 8px", borderRadius: 10 }}>#1 City</span>}
                  </div>
                  <div style={{ height: 4, background: "var(--gray-100)", borderRadius: 2, width: `${city.bar}%` }}>
                    <div style={{ height: "100%", width: "100%", background: "var(--blue)", borderRadius: 2 }} />
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "var(--navy)" }}>{city.donors.toLocaleString()}</span>
                <span style={{ fontSize: 14, color: "var(--navy)" }}>{city.patients.toLocaleString()}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green)" }}>${(city.earned / 1000).toFixed(0)}k</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `conic-gradient(var(--blue) ${city.bar * 3.6}deg, var(--gray-200) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 22, height: 22, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "var(--navy)" }}>{city.bar}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ padding: "80px 32px", background: "var(--navy)", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 3vw, 32px)", color: "white", lineHeight: 1.5, fontStyle: "italic", marginBottom: 24 }}>
            "The patients who receive these donations often have no other options. What Vitalink has done is create a sustainable, dignified pipeline of human generosity."
          </p>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Dr. Amara Osei — Hematology, Northwestern Medicine</div>
        </div>
      </div>
    </div>
  );
}
