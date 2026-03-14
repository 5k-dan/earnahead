"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const contributions = [
  {
    id: "research",
    label: "Clinical Research",
    svgX: 110, svgY: 30,          // head
    labelX: 148, labelY: 10,
    color: "#1D5FA8",
    comp: "$50–500+",
    sub: "per study",
    frequency: "Varies by trial",
    duration: "2–8 hrs per visit",
    headline: "Your participation shapes the next treatment.",
    body: "FDA-regulated clinical trials need healthy, consenting participants to generate the data that moves medicine forward. From single-visit cognitive screenings to multi-month pharmaceutical studies, EarnAhead surfaces verified trials near you. You choose the commitment level. The compensation reflects the depth of involvement.",
    aside: "2,847 active studies currently enrolling across the US.",
  },
  {
    id: "blood",
    label: "Whole Blood",
    svgX: 14, svgY: 162,          // left arm
    labelX: 2, labelY: 142,
    color: "#8B1F1F",
    comp: "$20–50",
    sub: "per donation",
    frequency: "Every 56 days",
    duration: "45 minutes",
    headline: "One draw. Three lives.",
    body: "Whole blood is separated into red cells, plasma, and platelets — each component sent to a different patient. Trauma victims, cancer patients mid-chemotherapy, premature infants. Donation is limited to every 56 days by regulation, which keeps the process safe and the supply consistent.",
    aside: "Over 40,000 pints transfused every day in the United States.",
  },
  {
    id: "plasma",
    label: "Plasma",
    svgX: 206, svgY: 162,         // right arm
    labelX: 192, labelY: 142,
    color: "#B5451E",
    comp: "$50–110",
    sub: "per session",
    frequency: "Up to 2× per week",
    duration: "90 minutes",
    headline: "The most frequent. The most consistent earnings.",
    body: "Plasma is the protein-rich liquid portion of your blood. It's used to manufacture treatments for rare immune disorders, hemophilia, and severe burns — conditions where synthetic alternatives don't exist. Because plasma replenishes quickly, donation up to twice a week is medically safe. The most consistent earners on EarnAhead donate plasma.",
    aside: "Average contributor earns $420–$680/month from plasma alone.",
  },
  {
    id: "egg",
    label: "Egg Donation",
    svgX: 66, svgY: 232,          // left hip
    labelX: 52, labelY: 212,
    color: "#2D7A5A",
    comp: "$5,000–30,000",
    sub: "per cycle",
    frequency: "1–2 cycles per year",
    duration: "3–4 week process",
    headline: "The most significant contribution. The highest compensation.",
    body: "Egg donation helps families who cannot conceive naturally — couples, single parents, same-sex partners. The process involves medical screening, hormone therapy, and a single retrieval procedure performed under sedation. The thorough evaluation and multi-week commitment is reflected in the compensation, which is among the highest of any contribution type.",
    aside: "1 in 8 couples in the US faces infertility.",
  },
  {
    id: "sperm",
    label: "Sperm Donation",
    svgX: 154, svgY: 232,         // right hip
    labelX: 140, labelY: 212,
    color: "#6B4A9B",
    comp: "$100–200",
    sub: "per sample",
    frequency: "2–3× per month",
    duration: "30 minutes",
    headline: "Consistent. Flexible. Ongoing.",
    body: "Approved sperm donors provide ongoing support to fertility clinics and cryobanks. After an initial screening and a quarantine period to confirm viability, scheduling is entirely yours to manage. Compensation arrives per approved sample. Many donors maintain an engagement of 6–12 months, building a reliable secondary income stream.",
    aside: "Up to $600/month once fully enrolled.",
  },
];

/* ─── Body SVG ─────────────────────────────────────────────────────────── */

function BodyFigure({ active }: { active: string | null }) {
  const sc = "var(--figure-stroke)";
  const sw = 1.5;

  return (
    <svg
      viewBox="0 0 220 390"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 200, display: "block", overflow: "visible" }}
    >
      <style>{`
        @keyframes dot-breathe {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .dot-idle { animation: dot-breathe 2.8s ease-in-out infinite; }
      `}</style>

      {/* ── Body lines ── */}
      {/* Head */}
      <ellipse cx="110" cy="30" rx="24" ry="26" stroke={sc} strokeWidth={sw} />

      {/* Neck */}
      <path d="M 100 55 L 100 72 L 120 72 L 120 55" stroke={sc} strokeWidth={sw} />

      {/* Clavicles */}
      <path d="M 100 72 Q 78 74 46 84" stroke={sc} strokeWidth={sw} />
      <path d="M 120 72 Q 142 74 174 84" stroke={sc} strokeWidth={sw} />

      {/* Left arm */}
      <path d="M 46 84 C 32 115 18 158 14 202" stroke={sc} strokeWidth={sw} />
      {/* Right arm */}
      <path d="M 174 84 C 188 115 202 158 206 202" stroke={sc} strokeWidth={sw} />

      {/* Left torso side */}
      <path d="M 46 84 L 50 222" stroke={sc} strokeWidth={sw} />
      {/* Right torso side */}
      <path d="M 174 84 L 170 222" stroke={sc} strokeWidth={sw} />

      {/* Pelvis arc */}
      <path d="M 50 222 Q 110 238 170 222" stroke={sc} strokeWidth={sw} />

      {/* Left leg */}
      <path d="M 72 234 L 64 382" stroke={sc} strokeWidth={sw} />
      {/* Right leg */}
      <path d="M 148 234 L 156 382" stroke={sc} strokeWidth={sw} />

      {/* ── Hotspot dots ── */}
      {contributions.map((c) => {
        const isActive = active === c.id;
        const anyActive = active !== null;

        return (
          <g key={c.id}>
            {/* Pulse ring when active */}
            {isActive && (
              <circle
                cx={c.svgX} cy={c.svgY} r={18}
                fill={c.color} opacity={0.08}
              />
            )}
            {isActive && (
              <circle
                cx={c.svgX} cy={c.svgY} r={12}
                fill={c.color} opacity={0.15}
              />
            )}
            {/* Main dot */}
            <circle
              cx={c.svgX} cy={c.svgY}
              r={isActive ? 7 : 5}
              fill={c.color}
              opacity={anyActive && !isActive ? 0.18 : isActive ? 1 : 0.7}
              style={{ transition: "all 450ms ease" }}
              className={!anyActive ? "dot-idle" : undefined}
            />
            {/* Annotation line */}
            {isActive && (
              <line
                x1={c.svgX} y1={c.svgY}
                x2={c.labelX} y2={c.labelY}
                stroke={c.color} strokeWidth="0.75"
                strokeDasharray="3 2.5" opacity="0.5"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function SixPage() {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [zip, setZip] = useState("");
  const router = useRouter();
  const chapterRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-chapter");
            setActiveChapter(id && id !== "intro" ? id : null);
          }
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    chapterRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) router.push(`/combined/map?zip=${zip}`);
  };

  const active = contributions.find((c) => c.id === activeChapter) ?? null;

  return (
    <div style={{ paddingTop: 52, background: "var(--bg)" }}>

      {/* ── TWO-PANEL ZONE ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>

        {/* LEFT: Sticky body panel */}
        <div style={{
          flex: "0 0 42%",
          position: "sticky",
          top: 52,
          height: "calc(100vh - 52px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid var(--border-2)",
          padding: "40px 40px 56px",
          gap: 0,
        }}>
          {/* Figure */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <BodyFigure active={activeChapter} />
          </div>

          {/* Info below figure */}
          <div style={{
            height: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            transition: "all 400ms ease",
          }}>
            {active ? (
              <>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14,
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: active.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: active.color, fontWeight: 700 }}>
                    {active.label}
                  </span>
                </div>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 34, color: "var(--text)",
                  lineHeight: 1, letterSpacing: "-0.02em",
                  marginBottom: 6,
                }}>
                  {active.comp}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.04em" }}>
                  {active.sub}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 10 }}>
                  {active.frequency} · {active.duration}
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "var(--text-3)", fontWeight: 600, marginBottom: 14,
                }}>
                  5 contribution types
                </div>
                <div style={{
                  fontSize: 12, color: "var(--text-3)", lineHeight: 1.65,
                  maxWidth: 180,
                }}>
                  Each point maps a distinct opportunity.<br />
                  Scroll to explore.
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Scrollable content */}
        <div style={{ flex: 1 }}>

          {/* INTRO chapter */}
          <div
            data-chapter="intro"
            ref={(el) => { if (el) chapterRefs.current.set("intro", el); }}
            style={{
              minHeight: "calc(100vh - 52px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 72px",
            }}
          >
            <div style={{
              fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--text-3)", fontWeight: 600, marginBottom: 36,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ width: 28, height: 1, background: "var(--text-3)" }} />
              EarnAhead · Health Contributions
            </div>

            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(54px, 6.5vw, 88px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              margin: "0 0 36px",
            }}>
              Your body<br />
              already<br />
              <em style={{ fontStyle: "italic" }}>knows how<br />to help.</em>
            </h1>

            <p style={{
              fontSize: 16, color: "var(--text-2)", lineHeight: 1.8,
              maxWidth: 420, margin: "0 0 52px",
            }}>
              Five ways your biology creates income while giving
              someone else a fighting chance. The body on the left
              marks exactly where each contribution comes from.
              Scroll to learn each one.
            </p>

            <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: 380, marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Enter ZIP to find centers"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                maxLength={5}
                style={{
                  flex: 1, height: 52, padding: "0 20px",
                  background: "transparent",
                  border: "1px solid var(--border-2)", borderRight: "none",
                  color: "var(--text)", fontSize: 15,
                  outline: "none",
                  fontFamily: "'DM Serif Display', serif",
                  letterSpacing: "0.06em",
                }}
              />
              <button
                type="submit"
                disabled={zip.length !== 5}
                style={{
                  height: 52, padding: "0 24px",
                  background: zip.length === 5 ? "var(--text)" : "transparent",
                  color: zip.length === 5 ? "var(--bg)" : "var(--text-3)",
                  border: "1px solid var(--border-2)",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: zip.length === 5 ? "pointer" : "default",
                  transition: "all 200ms", fontFamily: "inherit",
                }}
              >
                Search
              </button>
            </form>

            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginTop: 16,
            }}>
              <div style={{ width: 20, height: 1, background: "var(--text-3)" }} />
              <span style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Scroll to explore each opportunity
              </span>
            </div>
          </div>

          {/* Contribution chapters */}
          {contributions.map((c, i) => (
            <div
              key={c.id}
              data-chapter={c.id}
              ref={(el) => { if (el) chapterRefs.current.set(c.id, el); }}
              style={{
                minHeight: "100vh",
                padding: "88px 72px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Chapter counter */}
              <div style={{
                fontSize: 9, color: "var(--text-3)",
                letterSpacing: "0.18em", textTransform: "uppercase",
                fontWeight: 600, marginBottom: 32,
              }}>
                {String(i + 1).padStart(2, "0")} / 05
              </div>

              {/* Type pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: 28,
              }}>
                <div style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: c.color, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 10, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: c.color, fontWeight: 700,
                }}>
                  {c.label}
                </span>
              </div>

              {/* Headline */}
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(34px, 3.8vw, 50px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: "0 0 28px",
                maxWidth: 500,
              }}>
                {c.headline}
              </h2>

              {/* Body text */}
              <p style={{
                fontSize: 15, color: "var(--text-2)", lineHeight: 1.88,
                maxWidth: 480, margin: "0 0 44px",
              }}>
                {c.body}
              </p>

              {/* Aside / stat callout */}
              <div style={{
                padding: "20px 24px",
                background: "var(--surface)",
                borderLeft: `3px solid ${c.color}`,
                maxWidth: 420,
                marginBottom: 44,
              }}>
                <p style={{
                  fontSize: 13, color: "var(--text-2)", lineHeight: 1.6,
                  margin: 0, fontStyle: "italic",
                }}>
                  {c.aside}
                </p>
              </div>

              {/* Stats row */}
              <div style={{
                display: "flex", gap: 48,
                paddingTop: 36,
                borderTop: "1px solid var(--border-2)",
              }}>
                <div>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 30, color: c.color,
                    lineHeight: 1, marginBottom: 8,
                  }}>
                    {c.comp}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.02em" }}>
                    {c.sub}
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 48 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: "var(--text)",
                    lineHeight: 1, marginBottom: 8,
                  }}>
                    {c.frequency}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Frequency</div>
                </div>
                <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 48 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: "var(--text)",
                    lineHeight: 1, marginBottom: 8,
                  }}>
                    {c.duration}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Per session</div>
                </div>
              </div>

              {/* Find centers link */}
              <div style={{ marginTop: 36 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: c.color,
                  borderBottom: `1px solid ${c.color}55`,
                  paddingBottom: 3,
                  cursor: "pointer",
                }}>
                  Find {c.label} Centers Near You →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FULL-WIDTH BOTTOM ────────────────────────────────────────────── */}

      {/* Raw truth section */}
      <div style={{
        background: "var(--text)",
        padding: "96px 80px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(22px, 2.8vw, 36px)",
            color: "var(--bg)",
            lineHeight: 1.55,
            letterSpacing: "-0.01em",
            fontStyle: "italic",
            marginBottom: 40,
          }}>
            "In the time it takes to read this sentence,<br />
            42 units of blood were transfused<br />
            in the United States."
          </div>
          <div style={{
            width: 32, height: 1,
            background: "rgba(244,239,230,0.3)",
            margin: "0 auto",
          }} />
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border-2)",
        borderBottom: "1px solid var(--border-2)",
        padding: "60px 80px",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
      }}>
        {[
          { n: "142,000+", label: "Total contributions facilitated" },
          { n: "$4.2M+", label: "Paid directly to contributors" },
          { n: "89,000+", label: "Patients helped" },
          { n: "2,400+", label: "Verified partner centers" },
        ].map((s, i) => (
          <div key={i} style={{
            paddingLeft: i > 0 ? 52 : 0,
            borderLeft: i > 0 ? "1px solid var(--border-2)" : "none",
          }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 38, color: "var(--text)",
              lineHeight: 1, marginBottom: 10,
              letterSpacing: "-0.02em",
            }}>
              {s.n}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: "var(--bg)",
        padding: "96px 80px",
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(44px, 5.5vw, 68px)",
            color: "var(--text)",
            letterSpacing: "-0.025em",
            lineHeight: 0.96,
            margin: "0 0 52px",
          }}>
            Start with your<br />ZIP code.
          </h2>
          <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: 16 }}>
            <input
              type="text"
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              maxLength={5}
              style={{
                flex: 1, height: 60, padding: "0 22px",
                background: "var(--surface)",
                border: "1px solid var(--border-2)", borderRight: "none",
                color: "var(--text)", fontSize: 20,
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
                background: zip.length === 5 ? "var(--text)" : "var(--surface)",
                color: zip.length === 5 ? "var(--bg)" : "var(--text-3)",
                border: "1px solid var(--border-2)",
                fontSize: 10, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
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
      </div>

      {/* Footer */}
      <footer style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "24px 52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 15, color: "var(--text)",
          letterSpacing: "0.02em",
        }}>
          EarnAhead
        </span>
        <span style={{
          fontSize: 10, color: "var(--text-3)",
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          © 2026 · All contributions through verified medical providers
        </span>
        <a href="/" style={{ fontSize: 11, color: "var(--text-3)", textDecoration: "none" }}>
          ← Picker
        </a>
      </footer>
    </div>
  );
}
