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
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
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
    time: "90 min", freq: "Up to 2× per week", monthly: "$500+/month",
    popular: true,
    desc: "Treats rare immune disorders, hemophilia, and burn injuries. Plasma is the highest-recurring earning opportunity on the platform — FDA-regulated, private, and accessible.",
  },
  {
    key: "blood",
    label: "Whole Blood",
    comp: "$20–50", sub: "per donation",
    time: "45 min", freq: "Every 56 days", monthly: null,
    popular: false,
    desc: "One donation can save up to three lives. Over 40,000 pints are transfused every day in the United States — the most universally needed contribution on the platform.",
  },
  {
    key: "research",
    label: "Clinical Research",
    comp: "$50–500+", sub: "per study",
    time: "2–8 hrs", freq: "Study-specific", monthly: null,
    popular: false,
    desc: "Participate in FDA-regulated clinical trials. Opportunities range from single-visit studies to multi-month research commitments with significantly higher compensation.",
  },
  {
    key: "egg",
    label: "Egg Donation",
    comp: "$5K–30K", sub: "per cycle",
    time: "Multi-week", freq: "Per cycle", monthly: null,
    popular: false,
    desc: "Help families who cannot conceive naturally. The highest single-payout opportunity on the platform. Requires thorough medical screening and a multi-week commitment.",
  },
  {
    key: "sperm",
    label: "Sperm Donation",
    comp: "$100–200", sub: "per sample",
    time: "30 min", freq: "2–3× per month", monthly: "$600+/month",
    popular: false,
    desc: "Ongoing support for fertility clinics and cryobanks. Once accepted and screened, compensation is consistent and the scheduling is flexible around your life.",
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
  const heroCountRef = useRef<HTMLDivElement>(null);
  const statsActive = useInView(statsRef as React.RefObject<HTMLElement>);
  const heroCountActive = useInView(heroCountRef as React.RefObject<HTMLElement>);

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <span style={{ display: "inline-block", width: 32, height: 1, background: "var(--accent)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", fontWeight: 600 }}>
              The Health Contribution Marketplace
            </span>
          </motion.div>
        </div>

        {/* Full-width rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(200,134,26,0.6) 15%, rgba(200,134,26,0.6) 85%, transparent 100%)", transformOrigin: "left" }}
        />

        {/* HEADLINE — the entire design lives here */}
        <div style={{ padding: "44px 80px 44px" }}>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(76px, 10.5vw, 148px)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--white)",
              margin: 0,
            }}
          >
            Your body.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(76px, 10.5vw, 148px)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--accent)",
              fontStyle: "italic",
              margin: "10px 0 0",
            }}
          >
            Their tomorrow.
          </motion.h1>
        </div>

        {/* Full-width rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(200,134,26,0.6) 15%, rgba(200,134,26,0.6) 85%, transparent 100%)", transformOrigin: "left" }}
        />

        {/* SEARCH + DESCRIPTOR — below the fold line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ padding: "44px 80px 0" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <p style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.82, margin: 0, maxWidth: 420 }}>
              Discover verified opportunities to donate blood, plasma, eggs, and more.
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
                  color: zip.length === 5 ? "#060D18" : "var(--text-3)",
                  border: `1px solid ${zip.length === 5 ? "var(--accent)" : "var(--border-2)"}`,
                  borderLeft: "none",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          ref={heroCountRef}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            borderTop: "1px solid var(--border)",
            padding: "18px 80px",
            display: "flex", alignItems: "center", gap: 0,
            background: "rgba(6, 13, 24, 0.6)", backdropFilter: "blur(12px)",
          }}
        >
          {[
            { value: 142300, suffix: "+", label: "contributions" },
            { value: 4200000, prefix: "$", label: "paid out" },
            { value: 89000, suffix: "+", label: "patients helped" },
            { value: 2400, suffix: "+", label: "verified centers" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1,
              display: "flex", alignItems: "baseline", gap: 10,
              paddingLeft: i > 0 ? 40 : 0,
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}>
              <AnimStat value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} active={heroCountActive} size={s.value >= 1000000 ? 20 : 22} />
              <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            All providers verified · HIPAA compliant
          </div>
        </motion.div>
      </section>

      {/* ── CONTRIBUTION LIST ─────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg)" }}>
        <div style={{ padding: "80px 80px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 3vw, 44px)",
              color: "var(--white)", letterSpacing: "-0.02em", margin: 0,
            }}>
              What you can contribute.
            </h2>
            <span style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              5 contribution types
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border-2)" }} />

        {contributions.map((c) => {
          const open = expanded === c.key;
          return (
            <div key={c.key}>
              <div
                onClick={() => setExpanded(open ? null : c.key)}
                style={{ padding: "0 80px", cursor: "pointer", transition: "background 200ms" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = open ? "rgba(200,134,26,0.05)" : "rgba(214,208,196,0.02)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = open ? "rgba(200,134,26,0.04)" : "transparent"}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 160px 120px 1fr 48px",
                  alignItems: "center",
                  padding: "30px 0",
                  gap: 16,
                  background: open ? "rgba(200,134,26,0.04)" : "transparent",
                  transition: "background 200ms",
                  margin: "0 -80px", padding: "30px 80px",
                } as React.CSSProperties}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 28, color: open ? "var(--accent)" : "var(--white)",
                      letterSpacing: "-0.01em", transition: "color 200ms",
                    }}>{c.label}</span>
                    {c.popular && (
                      <span style={{
                        fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                        color: "var(--accent)", padding: "2px 8px",
                        border: "1px solid rgba(200,134,26,0.4)",
                      }}>POPULAR</span>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 22, color: "var(--accent)", letterSpacing: "-0.01em",
                  }}>{c.comp}</span>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{c.time}</span>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{c.freq}</span>
                  <span style={{
                    fontSize: 20, color: open ? "var(--accent)" : "var(--text-3)",
                    textAlign: "right", transition: "color 200ms, transform 200ms",
                    display: "block",
                    transform: open ? "rotate(45deg)" : "none",
                  }}>+</span>
                </div>
              </div>

              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    padding: "0 80px",
                    borderTop: "1px solid var(--border)",
                    background: "rgba(200,134,26,0.03)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "40px 0 48px" }}>
                    <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.85, margin: 0 }}>{c.desc}</p>
                    <div style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 700 }}>Compensation</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>{c.comp}</div>
                        <div style={{ fontSize: 12, color: "var(--text-3)" }}>{c.sub}</div>
                      </div>
                      {c.monthly && (
                        <div>
                          <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 700 }}>Monthly potential</div>
                          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>{c.monthly.split("/")[0]}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 700 }}>Per session</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "var(--white)", lineHeight: 1 }}>{c.time}</div>
                      </div>
                      <Link href="/combined/map" style={{
                        display: "inline-block", alignSelf: "flex-end",
                        fontSize: 12, fontWeight: 700, color: "var(--accent)",
                        textDecoration: "none", letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(200,134,26,0.4)",
                        paddingBottom: 3,
                      }}>
                        Find centers →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              <div style={{ height: 1, background: "var(--border)" }} />
            </div>
          );
        })}

        <div style={{ height: 80 }} />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "80px 80px",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 96 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: 20 }}>Process</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(24px, 2.5vw, 36px)",
              color: "var(--white)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15,
            }}>How it<br />works.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
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

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "96px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 40, height: 1, background: "rgba(6,13,24,0.2)",
            margin: "0 auto 48px",
          }} />
          <blockquote style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(22px, 2.6vw, 36px)",
            color: "#060D18", lineHeight: 1.48,
            letterSpacing: "-0.01em", fontStyle: "italic",
            margin: "0 0 52px",
          }}>
            "I started donating plasma to make ends meet. Two years later,
            I've earned over $9,000 and helped an estimated 60 patients.
            I didn't know my body could do that."
          </blockquote>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#060D18", marginBottom: 4, letterSpacing: "0.01em" }}>Marcus T.</div>
          <div style={{ fontSize: 13, color: "#647080" }}>Plasma donor · Chicago, IL · 184 sessions</div>
          <div style={{ width: 40, height: 1, background: "rgba(6,13,24,0.2)", margin: "48px auto 0" }} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "96px 80px",
        textAlign: "center",
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
                fontFamily: "'DM Serif Display', serif",
                letterSpacing: "0.1em",
              }}
            />
            <button
              type="submit"
              disabled={zip.length !== 5}
              style={{
                height: 62, padding: "0 36px",
                background: zip.length === 5 ? "var(--accent)" : "var(--surface-3)",
                color: zip.length === 5 ? "#060D18" : "var(--text-3)",
                border: "none",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: zip.length === 5 ? "pointer" : "default",
                transition: "all 200ms", fontFamily: "inherit",
              }}
            >
              Find Opportunities
            </button>
          </form>
          <p style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
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
        <span style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.04em" }}>© 2026 LUMEN HEALTH · ALL CONTRIBUTIONS THROUGH VERIFIED MEDICAL PROVIDERS</span>
        <Link href="/" style={{ fontSize: 12, color: "var(--text-2)", textDecoration: "none" }}>← Picker</Link>
      </footer>
    </div>
  );
}
