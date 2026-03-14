"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
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

const sampleOpps = [
  { type: "PLASMA", org: "BioLife Plasma Services", comp: "$110", time: "90 min", dist: "0.3 mi", live: true },
  { type: "BLOOD", org: "American Red Cross", comp: "$50", time: "45 min", dist: "0.8 mi", live: true },
  { type: "RESEARCH", org: "Northwestern Medicine", comp: "$300", time: "2 hrs", dist: "1.2 mi", live: false },
];

function AnimatedStat({
  value, prefix = "", suffix = "", active, size = 52,
}: { value: number; prefix?: string; suffix?: string; active: boolean; size?: number }) {
  const n = useCountUp(value, active);
  return (
    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: size, lineHeight: 1, color: "var(--white)" }}>
      {prefix}{n >= 1000 ? n.toLocaleString() : n}{suffix}
    </span>
  );
}

export default function LumenLanding() {
  const [zip, setZip] = useState("");
  const router = useRouter();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsActive = useInView(statsRef as React.RefObject<HTMLElement>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) router.push(`/combined/map?zip=${zip}`);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        paddingTop: 64,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(200,134,26,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Gold glow */}
        <div style={{
          position: "absolute", right: "5%", top: "15%", width: 700, height: 600, pointerEvents: "none",
          background: "radial-gradient(ellipse, rgba(200,134,26,0.07) 0%, transparent 70%)",
        }} />

        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "80px 48px",
          width: "100%", display: "grid", gridTemplateColumns: "55fr 45fr",
          gap: 80, alignItems: "center",
        }}>
          {/* Left */}
          <div>
            <div style={{
              fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "var(--text-2)", marginBottom: 36, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--accent)", flexShrink: 0 }} />
              The Health Contribution Marketplace
            </div>

            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(64px, 6.5vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "var(--white)",
              margin: "0 0 6px",
            }}>
              Your body.
            </h1>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(64px, 6.5vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "var(--accent)",
              fontStyle: "italic",
              margin: "0 0 52px",
            }}>
              Their tomorrow.
            </h1>

            <p style={{
              fontSize: 17, lineHeight: 1.8, color: "var(--text-2)",
              maxWidth: 420, marginBottom: 44,
            }}>
              Discover verified opportunities to donate blood, plasma, eggs, and more —
              and earn real compensation for your contribution to community health.
            </p>

            <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: 36, maxWidth: 460 }}>
              <input
                type="text"
                placeholder="Enter ZIP code to discover opportunities"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                maxLength={5}
                style={{
                  flex: 1, height: 56, padding: "0 20px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-2)", borderRight: "none",
                  color: "var(--white)", fontSize: 16, outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                disabled={zip.length !== 5}
                style={{
                  height: 56, padding: "0 28px",
                  background: zip.length === 5 ? "var(--accent)" : "var(--surface-2)",
                  color: zip.length === 5 ? "#060D18" : "var(--text-3)",
                  border: `1px solid ${zip.length === 5 ? "var(--accent)" : "var(--border-2)"}`,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: zip.length === 5 ? "pointer" : "default",
                  transition: "all 200ms", fontFamily: "inherit",
                }}
              >
                Discover
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>
              <span>2,400+ verified centers</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-3)", display: "inline-block", flexShrink: 0 }} />
              <span>142k+ donations</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-3)", display: "inline-block", flexShrink: 0 }} />
              <span>$4.2M+ paid out</span>
            </div>
          </div>

          {/* Right — live opportunities panel */}
          <div>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,134,26,0.06)",
            }}>
              {/* Panel header */}
              <div style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#4ADE80",
                    boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                  }} />
                  <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500, letterSpacing: "0.02em" }}>
                    Opportunities near 60614
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.03em" }}>8 available</span>
              </div>

              {/* Opportunity rows */}
              {sampleOpps.map((opp, i) => (
                <div
                  key={i}
                  style={{
                    padding: "22px 24px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: "var(--accent)",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                      }}>{opp.type}</span>
                      {opp.live && (
                        <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 500 }}>● Available</span>
                      )}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--white)", marginBottom: 4, letterSpacing: "-0.01em" }}>
                      {opp.org}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>{opp.time} · {opp.dist}</div>
                  </div>
                  <div style={{ textAlign: "right", paddingLeft: 20 }}>
                    <div style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 26, color: "var(--accent)", lineHeight: 1, marginBottom: 3,
                    }}>{opp.comp}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>per session</div>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div style={{ padding: "16px 24px" }}>
                <Link
                  href="/combined/map"
                  style={{
                    display: "block", textAlign: "center",
                    fontSize: 13, fontWeight: 600, color: "var(--accent)",
                    textDecoration: "none", letterSpacing: "0.04em",
                    padding: "12px 0",
                    border: "1px solid var(--border-2)",
                    transition: "border-color 150ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-2)"}
                >
                  View all 8 opportunities on map →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAND ───────────────────────────────────────────────────────── */}
      <div style={{
        height: 48, background: "var(--surface)",
        borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{
          display: "flex", gap: 48, fontSize: 11, color: "var(--text-2)",
          letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 500,
          whiteSpace: "nowrap",
        }}>
          {[
            "All providers verified by licensed medical professionals",
            "HIPAA-compliant · Secure & private",
            "142,300+ successful contributions nationwide",
            "FDA-regulated plasma centers only",
          ].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 48 }}>
              {item}
              {i < 3 && <span style={{ color: "var(--border-2)", lineHeight: 1 }}>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── CONTRIBUTION TYPES ───────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16 }}>
                Contribution Types
              </div>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(40px, 4vw, 58px)",
                letterSpacing: "-0.025em", color: "#060D18", lineHeight: 1.02, margin: 0,
              }}>
                What you can contribute.
              </h2>
            </div>
            <p style={{ maxWidth: 320, fontSize: 15, lineHeight: 1.78, color: "#5A6A7E", textAlign: "right", flexShrink: 0 }}>
              From routine donations to multi-week clinical trials — each opportunity is verified,
              fairly compensated, and makes a measurable difference.
            </p>
          </div>

          {/* Row 1 */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            {/* Plasma — wide */}
            <div style={{
              flex: 2, background: "#0D1A2E", padding: "52px 52px",
              position: "relative", overflow: "hidden", cursor: "pointer",
              transition: "background 200ms",
            }}
              onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "#142237"}
              onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "#0D1A2E"}
            >
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 300, height: 300, pointerEvents: "none",
                background: "radial-gradient(ellipse, rgba(200,134,26,0.1) 0%, transparent 70%)",
              }} />
              <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: 28 }}>
                Most popular · Highest recurring earnings
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 44,
                color: "var(--white)", letterSpacing: "-0.02em", margin: "0 0 16px",
              }}>Plasma Donation</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 40, maxWidth: 380 }}>
                Treats rare immune disorders, burn injuries, and hemophilia.
                The most consistent and accessible earning opportunity on the platform.
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 36 }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: "var(--accent)", lineHeight: 1 }}>$50–110</span>
                <span style={{ fontSize: 14, color: "var(--text-2)" }}>per session</span>
              </div>
              <div style={{ display: "flex", gap: 48 }}>
                {[
                  { label: "Frequency", val: "Up to 2× per week" },
                  { label: "Session", val: "60–90 minutes" },
                  { label: "Monthly potential", val: "Up to $500+", gold: true },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: item.gold ? "var(--accent)" : "var(--text)", fontWeight: item.gold ? 600 : 500 }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blood */}
            <div style={{
              flex: 1, background: "#0D1A2E", padding: "44px 40px", cursor: "pointer",
              transition: "background 200ms",
            }}
              onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "#142237"}
              onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "#0D1A2E"}
            >
              <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-2)", fontWeight: 600, marginBottom: 28 }}>Whole Blood</div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, color: "var(--white)", letterSpacing: "-0.02em", margin: "0 0 16px" }}>Blood Donation</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 36 }}>
                One donation can save up to 3 lives. The most widely needed contribution, with centers nationwide.
              </p>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: "var(--accent)", lineHeight: 1, marginBottom: 8 }}>$20–50</div>
              <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 32 }}>per donation</div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>Every 56 days · 45 min session</div>
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              {
                label: "Clinical Research",
                comp: "$50–500+", sub: "per study",
                freq: "Varies by trial", time: "2–8 hrs per visit",
                desc: "Advance treatments for millions by participating in FDA-regulated clinical studies and trials.",
              },
              {
                label: "Egg Donation",
                comp: "$5K–30K", sub: "per cycle",
                freq: "Selective process", time: "Multi-week commitment",
                desc: "Help families unable to conceive naturally. The highest single-payout opportunity on the platform.",
              },
              {
                label: "Sperm Donation",
                comp: "$100–200", sub: "per sample",
                freq: "2–3× per month", time: "30 min per visit",
                desc: "Support fertility treatment and family building through regular, ongoing contribution.",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  flex: 1, background: "#0D1A2E", padding: "40px 36px", cursor: "pointer",
                  transition: "background 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "#142237"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "#0D1A2E"}
              >
                <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-2)", fontWeight: 600, marginBottom: 24 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "var(--accent)", lineHeight: 1, marginBottom: 8 }}>
                  {item.comp}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 24 }}>{item.sub}</div>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 28 }}>{item.desc}</p>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>{item.freq} · {item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg)", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 72 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 20 }}>
              How it works
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "var(--white)", letterSpacing: "-0.025em", margin: 0,
            }}>
              Three steps. Real impact.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              {
                n: "01", title: "Search",
                body: "Enter your ZIP code to discover verified donation centers, clinical trials, and research studies in your area.",
              },
              {
                n: "02", title: "Schedule",
                body: "Review compensation, eligibility requirements, and time commitment. Book directly through verified partner facilities.",
              },
              {
                n: "03", title: "Earn",
                body: "Show up, contribute, and receive compensation directly. Track your sessions, earnings, and community impact over time.",
              },
            ].map((step, i) => (
              <div key={i} style={{
                padding: `48px ${i < 2 ? "48px" : "0"} 48px ${i > 0 ? "48px" : "0"}`,
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 88, lineHeight: 1,
                  color: "rgba(214,208,196,0.05)",
                  marginBottom: 24, letterSpacing: "-0.04em",
                }}>{step.n}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16 }}>
                  {step.title}
                </div>
                <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.8, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
          padding: "80px 48px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { value: 142300, suffix: "+", label: "Total contributions nationwide" },
            { value: 4200000, prefix: "$", label: "Paid to contributors", large: true },
            { value: 89000, suffix: "+", label: "Patients directly helped" },
            { value: 2400, suffix: "+", label: "Verified partner centers" },
          ].map((s, i) => (
            <div key={i} style={{
              paddingLeft: i > 0 ? 48 : 0,
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ marginBottom: 12 }}>
                <AnimatedStat value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} active={statsActive} size={s.large ? 44 : 52} />
              </div>
              <div style={{ fontSize: 13, color: "var(--text-2)", letterSpacing: "0.01em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED STORY ───────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg)", padding: "96px 48px" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 40 }}>
              Community
            </div>
            <blockquote style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(22px, 2.4vw, 32px)",
              color: "var(--white)", lineHeight: 1.48,
              letterSpacing: "-0.01em", fontStyle: "italic",
              margin: "0 0 48px",
            }}>
              "I started donating plasma to make ends meet. Two years later, I've earned over $9,000
              and donated enough plasma to help an estimated 60 patients. I didn't know my body could do that."
            </blockquote>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--white)", marginBottom: 4 }}>Marcus T.</div>
              <div style={{ fontSize: 13, color: "var(--text-2)" }}>Plasma donor · Chicago, IL · 2 years active</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Total earned", value: "$9,200", sub: "over 24 months" },
              { label: "Sessions completed", value: "184", sub: "plasma donations" },
              { label: "Patients helped", value: "~60", sub: "estimated impact" },
              { label: "Centers visited", value: "3", sub: "across Chicago, IL" },
            ].map((item) => (
              <div key={item.label} style={{
                background: "var(--surface)", border: "1px solid var(--border)", padding: "28px 24px",
              }}>
                <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)", marginBottom: 14 }}>{item.label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: "var(--accent)", lineHeight: 1, marginBottom: 6 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "96px 48px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 24 }}>
            Get started
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(40px, 4.5vw, 68px)",
            color: "var(--white)", letterSpacing: "-0.025em", lineHeight: 1.02, marginBottom: 20,
          }}>
            Ready to contribute?
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 48 }}>
            Enter your ZIP code and discover verified opportunities nearby. Takes 30 seconds.
          </p>
          <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: 480, margin: "0 auto 24px" }}>
            <input
              type="text"
              placeholder="Your ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              maxLength={5}
              style={{
                flex: 1, height: 56, padding: "0 20px",
                background: "var(--surface-2)",
                border: "1px solid var(--border-2)", borderRight: "none",
                color: "var(--white)", fontSize: 16, outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={zip.length !== 5}
              style={{
                height: 56, padding: "0 32px",
                background: zip.length === 5 ? "var(--accent)" : "var(--surface-3)",
                color: zip.length === 5 ? "#060D18" : "var(--text-3)",
                border: "none", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: zip.length === 5 ? "pointer" : "default",
                transition: "all 200ms", fontFamily: "inherit",
              }}
            >
              Find Opportunities
            </button>
          </form>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Free to use · No account required to browse</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{
        background: "var(--bg)", borderTop: "1px solid var(--border)",
        padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--accent)", letterSpacing: "0.06em" }}>LUMEN</span>
        <span style={{ fontSize: 12, color: "var(--text-3)" }}>© 2026 Lumen Health · All contributions through verified medical providers.</span>
        <Link href="/" style={{ fontSize: 12, color: "var(--text-2)", textDecoration: "none" }}>← Picker</Link>
      </footer>
    </div>
  );
}
