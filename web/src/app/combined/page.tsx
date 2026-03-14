"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

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
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(frame);
      else setValue(target);
    };
    requestAnimationFrame(frame);
  }, [active]);
  return value;
}

const contributions = [
  {
    key: "plasma",
    label: "Plasma",
    comp: "$50–110", sub: "per session",
    facts: "Up to 2× per week  ·  90 min  ·  FDA-regulated",
    monthly: "$500+ monthly",
    popular: true,
    desc: "Treats rare immune disorders, hemophilia, and burn injuries. Plasma is the most consistent earning opportunity on the platform — you can donate twice a week, year-round.",
  },
  {
    key: "blood",
    label: "Whole Blood",
    comp: "$20–50", sub: "per donation",
    facts: "Every 56 days  ·  45 min  ·  Saves up to 3 lives",
    monthly: null,
    popular: false,
    desc: "The most universally needed contribution. Over 40,000 pints are transfused daily across the United States — demand never stops.",
  },
  {
    key: "research",
    label: "Clinical Research",
    comp: "$50–500+", sub: "per study",
    facts: "Varies by trial  ·  2–8 hrs per visit  ·  Multi-visit studies available",
    monthly: null,
    popular: false,
    desc: "Participate in FDA-regulated clinical trials. Studies range from single-visit screenings to multi-month research with significantly higher compensation.",
  },
  {
    key: "egg",
    label: "Egg Donation",
    comp: "$5,000–30,000", sub: "per cycle",
    facts: "Per cycle  ·  Multi-week commitment  ·  Thorough screening required",
    monthly: null,
    popular: false,
    desc: "Help families who cannot conceive naturally. The highest single-payout opportunity on the platform. Requires extensive medical evaluation and a several-week process.",
  },
  {
    key: "sperm",
    label: "Sperm Donation",
    comp: "$100–200", sub: "per sample",
    facts: "2–3× per month  ·  30 min  ·  Initial screening required",
    monthly: "$600+ monthly",
    popular: false,
    desc: "Ongoing support for fertility clinics and cryobanks. Once screened and accepted, scheduling is flexible and compensation is consistent.",
  },
];

function AnimStat({ value, prefix = "", suffix = "", active, size = 52 }: {
  value: number; prefix?: string; suffix?: string; active: boolean; size?: number;
}) {
  const n = useCountUp(value, active);
  return (
    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: size, lineHeight: 1, color: "var(--white)", letterSpacing: "-0.02em" }}>
      {prefix}{n >= 1000 ? n.toLocaleString() : n}{suffix}
    </span>
  );
}

export default function LumenLanding() {
  const [zip, setZip] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();
  const statsRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const statsActive = useInView(statsRef as React.RefObject<HTMLElement>);
  const bottomBarActive = useInView(bottomBarRef as React.RefObject<HTMLElement>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) router.push(`/combined/map?zip=${zip}`);
  };

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", paddingTop: 64, background: "var(--bg)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Overline */}
        <div style={{ padding: "0 80px", marginBottom: 32 }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <span style={{ display: "inline-block", width: 32, height: 1, background: "var(--accent)", flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", fontWeight: 600 }}>
              The Health Contribution Marketplace
            </span>
          </motion.div>
        </div>

        {/* Rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1, transformOrigin: "left",
            background: "linear-gradient(90deg, transparent, rgba(28,184,94,0.5) 15%, rgba(28,184,94,0.5) 85%, transparent)",
          }}
        />

        {/* Headline */}
        <div style={{ padding: "44px 80px" }}>
          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(72px, 10.5vw, 148px)",
              lineHeight: 0.88, letterSpacing: "-0.03em",
              color: "var(--white)", margin: 0,
            }}
          >
            Your body.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(72px, 10.5vw, 148px)",
              lineHeight: 0.88, letterSpacing: "-0.03em",
              color: "var(--accent)", fontStyle: "italic",
              margin: "10px 0 0",
            }}
          >
            Their tomorrow.
          </motion.h1>
        </div>

        {/* Rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1, transformOrigin: "left",
            background: "linear-gradient(90deg, transparent, rgba(28,184,94,0.5) 15%, rgba(28,184,94,0.5) 85%, transparent)",
          }}
        />

        {/* Search + descriptor */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ padding: "44px 80px 0" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <p style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.82, margin: 0, maxWidth: 420 }}>
              Discover verified opportunities to donate blood, plasma, and more.
              Earn real compensation. Make a measurable difference in your community.
            </p>
            <form onSubmit={handleSearch} style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Enter your ZIP code"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                maxLength={5}
                style={{
                  flex: 1, height: 60, padding: "0 24px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border-2)",
                  borderLeft: "1px solid var(--border-2)",
                  color: "var(--white)", fontSize: 18,
                  outline: "none",
                  fontFamily: "'DM Serif Display', serif",
                  letterSpacing: "0.08em",
                }}
              />
              <button
                type="submit"
                disabled={zip.length !== 5}
                style={{
                  height: 60, padding: "0 32px",
                  background: zip.length === 5 ? "var(--accent)" : "transparent",
                  color: zip.length === 5 ? "#0C0D0C" : "var(--text-3)",
                  border: `1px solid ${zip.length === 5 ? "var(--accent)" : "var(--border-2)"}`,
                  borderLeft: "none",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: zip.length === 5 ? "pointer" : "default",
                  transition: "all 200ms", fontFamily: "inherit",
                }}
              >
                Discover
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom data bar */}
        <motion.div
          ref={bottomBarRef}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            borderTop: "1px solid var(--border)",
            padding: "16px 80px",
            display: "flex", alignItems: "center",
            background: "rgba(12,13,12,0.7)", backdropFilter: "blur(12px)",
          }}
        >
          {[
            { value: 142300, suffix: "+", label: "contributions" },
            { value: 4200000, prefix: "$", label: "paid out" },
            { value: 89000, suffix: "+", label: "patients helped" },
            { value: 2400, suffix: "+", label: "verified centers" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, display: "flex", alignItems: "baseline", gap: 10,
              paddingLeft: i > 0 ? 36 : 0,
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}>
              <AnimStat value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} active={bottomBarActive} size={s.value >= 1000000 ? 19 : 22} />
              <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
          <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>
            All providers verified · HIPAA compliant
          </span>
        </motion.div>
      </section>

      {/* ── CONTRIBUTION LIST ─────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg)" }}>
        {/* Section head */}
        <div style={{ padding: "80px 80px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 3vw, 44px)",
              color: "var(--white)", letterSpacing: "-0.02em", margin: 0,
            }}>
              What you can contribute.
            </h2>
            <Link href="/combined/map" style={{
              fontSize: 12, fontWeight: 600, color: "var(--accent)",
              textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              Find centers near you →
            </Link>
          </div>
        </div>

        {/* Column labels */}
        <div style={{
          padding: "10px 80px",
          display: "grid", gridTemplateColumns: "1fr 200px 48px",
          fontSize: 9, color: "var(--text-3)",
          letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700,
        }}>
          <span>Contribution type</span>
          <span>Compensation</span>
          <span />
        </div>

        {/* Top border */}
        <div style={{ height: 1, background: "var(--border-2)", margin: "0" }} />

        {contributions.map((c) => {
          const open = expanded === c.key;
          return (
            <div key={c.key} style={{ borderBottom: "1px solid var(--border)" }}>
              {/* Row */}
              <div
                onClick={() => setExpanded(open ? null : c.key)}
                style={{
                  padding: "0 80px",
                  cursor: "pointer",
                  background: open ? "rgba(28,184,94,0.04)" : "transparent",
                  transition: "background 200ms",
                }}
                onMouseEnter={(e) => {
                  if (!open) (e.currentTarget as HTMLDivElement).style.background = "rgba(184,189,181,0.02)";
                }}
                onMouseLeave={(e) => {
                  if (!open) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 48px",
                  alignItems: "center",
                  padding: "28px 0",
                  gap: 16,
                }}>
                  {/* Name + facts */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                      <span style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: 30, color: open ? "var(--accent)" : "var(--white)",
                        letterSpacing: "-0.01em", transition: "color 200ms",
                      }}>{c.label}</span>
                      {c.popular && (
                        <span style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                          color: "var(--accent)", padding: "2px 8px",
                          border: "1px solid rgba(28,184,94,0.35)",
                          textTransform: "uppercase",
                        }}>Most popular</span>
                      )}
                      {c.monthly && (
                        <span style={{
                          fontSize: 11, color: "var(--accent)", fontWeight: 500,
                        }}>
                          {c.monthly}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.02em" }}>
                      {c.facts}
                    </div>
                  </div>

                  {/* Compensation */}
                  <div>
                    <div style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 22, color: "var(--accent)",
                      letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 3,
                    }}>{c.comp}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.sub}</div>
                  </div>

                  {/* Toggle */}
                  <div style={{
                    fontSize: 18, color: open ? "var(--accent)" : "var(--text-3)",
                    textAlign: "right", transition: "color 200ms",
                    transform: open ? "rotate(45deg)" : "none",
                    display: "block",
                  }}>+</div>
                </div>
              </div>

              {/* Expanded detail */}
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    padding: "0 80px",
                    borderTop: "1px solid var(--border)",
                    background: "rgba(28,184,94,0.03)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "36px 0 44px" }}>
                    <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.85, margin: 0 }}>{c.desc}</p>
                    <div style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 700 }}>Compensation</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>{c.comp}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.sub}</div>
                      </div>
                      {c.monthly && (
                        <div>
                          <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 700 }}>Monthly potential</div>
                          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "var(--accent)", lineHeight: 1 }}>{c.monthly.split(" ")[0]}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 700 }}>Per session</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "var(--white)", lineHeight: 1 }}>{c.facts.split("·")[0].trim()}</div>
                      </div>
                      <Link href="/combined/map" style={{
                        alignSelf: "flex-end", fontSize: 11, fontWeight: 700,
                        color: "var(--accent)", textDecoration: "none", letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(28,184,94,0.4)", paddingBottom: 3,
                      }}>
                        Find centers →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        <div style={{ height: 80 }} />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        padding: "80px 80px",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 96 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: 20 }}>Process</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(26px, 2.5vw, 36px)",
              color: "var(--white)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15,
            }}>How it<br />works.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { n: "01", title: "Search", body: "Enter your ZIP to see verified donation centers, clinical trials, and studies near you." },
              { n: "02", title: "Schedule", body: "Review compensation and eligibility. Book directly through verified partner facilities." },
              { n: "03", title: "Earn", body: "Complete your session. Receive direct payment. Track your lifetime impact." },
            ].map((step, i) => (
              <div key={i} style={{
                paddingLeft: i > 0 ? 44 : 0,
                paddingRight: i < 2 ? 44 : 0,
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>{step.n}</div>
                <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>{step.title}</div>
                <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT NUMBERS ───────────────────────────────────────────────── */}
      <div ref={statsRef} style={{ background: "var(--bg)", padding: "96px 80px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { value: 142300, suffix: "+", label: "Total contributions nationwide" },
            { value: 4200000, prefix: "$", label: "Paid directly to contributors" },
            { value: 89000, suffix: "+", label: "Patients helped by donations" },
            { value: 2400, suffix: "+", label: "Verified partner centers" },
          ].map((s, i) => (
            <div key={i} style={{
              paddingLeft: i > 0 ? 60 : 0,
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}>
              <AnimStat value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} active={statsActive} size={s.value >= 1000000 ? 44 : 52} />
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PULL QUOTE — light inversion section ─────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "96px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 36, height: 1, background: "rgba(12,13,12,0.18)", margin: "0 auto 52px" }} />
          <blockquote style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(22px, 2.6vw, 34px)",
            color: "#0C0D0C", lineHeight: 1.5,
            letterSpacing: "-0.01em", fontStyle: "italic",
            margin: "0 0 52px",
          }}>
            "I never thought about what my donation meant until a nurse explained
            it goes to someone with an autoimmune disorder who can't produce
            the proteins they need to survive. I've been back 62 times."
          </blockquote>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0C0D0C", marginBottom: 4, letterSpacing: "0.01em" }}>James R.</div>
          <div style={{ fontSize: 13, color: "#525650" }}>Plasma donor · Philadelphia, PA · 62 sessions</div>
          <div style={{ width: 36, height: 1, background: "rgba(12,13,12,0.18)", margin: "52px auto 0" }} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--surface)", borderTop: "1px solid var(--border)",
        padding: "96px 80px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(44px, 5.5vw, 72px)",
            color: "var(--white)", letterSpacing: "-0.025em",
            lineHeight: 1, marginBottom: 52,
          }}>
            Ready to<br />contribute?
          </h2>
          <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: 20 }}>
            <input
              type="text"
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              maxLength={5}
              style={{
                flex: 1, height: 62, padding: "0 24px",
                background: "var(--surface-2)",
                border: "1px solid var(--border-2)", borderRight: "none",
                color: "var(--white)", fontSize: 20,
                outline: "none",
                fontFamily: "'DM Serif Display', serif", letterSpacing: "0.1em",
              }}
            />
            <button
              type="submit"
              disabled={zip.length !== 5}
              style={{
                height: 62, padding: "0 36px",
                background: zip.length === 5 ? "var(--accent)" : "var(--surface-3)",
                color: zip.length === 5 ? "#0C0D0C" : "var(--text-3)",
                border: "none", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: zip.length === 5 ? "pointer" : "default",
                transition: "all 200ms", fontFamily: "inherit",
              }}
            >
              Find Opportunities
            </button>
          </form>
          <p style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Free to browse · No account required
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        background: "var(--bg)", borderTop: "1px solid var(--border)",
        padding: "28px 80px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "var(--accent)", letterSpacing: "0.08em" }}>LUMEN</span>
        <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          © 2026 Lumen Health · All contributions through verified medical providers
        </span>
        <Link href="/" style={{ fontSize: 12, color: "var(--text-2)", textDecoration: "none" }}>← Picker</Link>
      </footer>
    </div>
  );
}
