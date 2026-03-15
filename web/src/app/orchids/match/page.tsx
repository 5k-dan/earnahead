"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Eligibility data (mirrors listings/map hardcoded data) ──────────────────

const ALL_OPPORTUNITIES = [
  { id: 1, type: "Plasma",   name: "BioLife Plasma Services",       earn: 85,   earnLabel: "$85/visit",    freq: "Up to 2×/week",  weeklyMax: 170, time: "90 min",   minAge: 18, maxAge: 65, needsWeight: true,  sexFilter: null       },
  { id: 2, type: "Blood",    name: "Lifestream Blood Center",       earn: 50,   earnLabel: "$50/visit",    freq: "Every 56 days",  weeklyMax: 50,  time: "60 min",   minAge: 17, maxAge: 99, needsWeight: true,  sexFilter: null       },
  { id: 3, type: "Research", name: "Northwestern Clinical Trials",  earn: 200,  earnLabel: "$200/visit",   freq: "4 visits total", weeklyMax: 200, time: "4 hrs",    minAge: 21, maxAge: 55, needsWeight: false, sexFilter: null       },
  { id: 4, type: "Plasma",   name: "CSL Plasma",                    earn: 90,   earnLabel: "$90/visit",    freq: "Up to 2×/week",  weeklyMax: 180, time: "90 min",   minAge: 18, maxAge: 65, needsWeight: true,  sexFilter: null       },
  { id: 5, type: "Sperm",    name: "New England Cryogenic Center",  earn: 150,  earnLabel: "$150/visit",   freq: "Up to 3×/week",  weeklyMax: 450, time: "45 min",   minAge: 18, maxAge: 39, needsWeight: false, sexFilter: "male"     },
  { id: 6, type: "Egg",      name: "Shady Grove Fertility",         earn: 8500, earnLabel: "$8,500/cycle", freq: "1–2×/year",      weeklyMax: 8500,time: "4–6 wks",  minAge: 21, maxAge: 32, needsWeight: false, sexFilter: "female"   },
  { id: 7, type: "Blood",    name: "American Red Cross",            earn: 45,   earnLabel: "$45/visit",    freq: "Every 56 days",  weeklyMax: 45,  time: "60 min",   minAge: 16, maxAge: 99, needsWeight: true,  sexFilter: null       },
];

const TYPE_COLORS: Record<string, { bg: string; light: string; text: string }> = {
  Plasma:   { bg: "#1d5fa8", light: "#e8f0f8", text: "#1d5fa8" },
  Blood:    { bg: "#c0392b", light: "#fde8e8", text: "#c0392b" },
  Research: { bg: "#0d1f3c", light: "#e8ecf2", text: "#0d1f3c" },
  Sperm:    { bg: "#5c3d8a", light: "#ede8f5", text: "#5c3d8a" },
  Egg:      { bg: "#2ecc71", light: "#eafaf1", text: "#1a8a4a" },
};

// Age ranges mapped to midpoint for eligibility checking
const AGE_RANGES = [
  { label: "16–17", value: 16 },
  { label: "18–24", value: 21 },
  { label: "25–34", value: 29 },
  { label: "35–44", value: 39 },
  { label: "45–55", value: 50 },
  { label: "56–65", value: 60 },
  { label: "65+",   value: 66 },
];

type Sex = "male" | "female" | "other";
type Weight = "under" | "110plus";

interface Profile {
  age: number;
  sex: Sex;
  weight: Weight;
}

function getMatches(profile: Profile) {
  return ALL_OPPORTUNITIES.filter((o) => {
    if (profile.age < o.minAge || profile.age > o.maxAge) return false;
    if (o.needsWeight && profile.weight === "under") return false;
    if (o.sexFilter === "male"   && profile.sex !== "male")   return false;
    if (o.sexFilter === "female" && profile.sex !== "female") return false;
    return true;
  });
}

function calcWeeklyMax(matches: typeof ALL_OPPORTUNITIES) {
  // Sum the best realistic weekly potential across all matched types
  // (plasma + blood + research + sperm/egg best case)
  const byType: Record<string, number> = {};
  for (const m of matches) {
    if (!byType[m.type] || m.weeklyMax > byType[m.type]) {
      byType[m.type] = m.weeklyMax;
    }
  }
  return Object.values(byType).reduce((s, v) => s + v, 0);
}

// ─── Step components ──────────────────────────────────────────────────────────

function OptionCard({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 24px",
        border: `2px solid ${selected ? "var(--blue)" : "var(--border)"}`,
        borderRadius: 10,
        background: selected ? "#f0f5fb" : "white",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 150ms, background 150ms",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: selected ? "var(--navy)" : "var(--text-secondary)" }}>
        {label}
      </span>
      {sub && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</span>}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefilledZip = searchParams.get("zip") ?? "";

  const [step, setStep]     = useState<1 | 2 | 3 | "results">(1);
  const [age, setAge]       = useState<number | null>(null);
  const [sex, setSex]       = useState<Sex | null>(null);
  const [weight, setWeight] = useState<Weight | null>(null);

  const matches = (step === "results" && age !== null && sex !== null && weight !== null)
    ? getMatches({ age, sex, weight })
    : [];

  const weeklyMax = calcWeeklyMax(matches);

  const progress = step === "results" ? 100 : ((step as number) / 3) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)", paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: "var(--navy)", padding: "48px 32px 40px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Eligibility Check · 3 questions
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4vw, 38px)", color: "white", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
            {step === "results" ? "Here's what you qualify for" : "See what you could earn"}
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            {step === "results"
              ? `${matches.length} of ${ALL_OPPORTUNITIES.length} opportunities match your profile.`
              : "No account needed. Takes under 30 seconds."}
          </p>
          {/* Progress bar */}
          <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--green-light)", borderRadius: 2, transition: "width 400ms ease" }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 32px" }}>

        {/* ── Step 1: Age ─────────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>How old are you?</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Age determines eligibility for several donation types.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {AGE_RANGES.map((r) => (
                <OptionCard
                  key={r.label}
                  label={r.label}
                  selected={age === r.value}
                  onClick={() => {
                    setAge(r.value);
                    setTimeout(() => setStep(2), 180);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Sex ──────────────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>Biological sex?</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Used only to determine eligibility for sperm and egg donation programs.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { value: "male"   as Sex, label: "Male",               sub: "Eligible for sperm donation programs" },
                { value: "female" as Sex, label: "Female",             sub: "Eligible for egg donation programs" },
                { value: "other"  as Sex, label: "Prefer not to say",  sub: "We'll match you on all other criteria" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  sub={opt.sub}
                  selected={sex === opt.value}
                  onClick={() => {
                    setSex(opt.value);
                    setTimeout(() => setStep(3), 180);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Weight ───────────────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>Your weight?</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Blood and plasma donation centers require a minimum of 110 lbs for donor safety.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { value: "110plus" as Weight, label: "110 lbs or more", sub: "Meets weight requirement for blood & plasma" },
                { value: "under"   as Weight, label: "Under 110 lbs",   sub: "Still eligible for research and other programs" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  sub={opt.sub}
                  selected={weight === opt.value}
                  onClick={() => {
                    setWeight(opt.value);
                    setTimeout(() => setStep("results"), 180);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────────── */}
        {step === "results" && (
          <div>
            {/* Earnings summary card */}
            <div style={{
              background: "var(--navy)", borderRadius: 12, padding: "28px 32px",
              marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Your weekly earning potential
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: "var(--green-light)", lineHeight: 1 }}>
                  {weeklyMax >= 1000
                    ? `$${(weeklyMax / 1000).toFixed(1).replace(/\.0$/, "")}k+`
                    : `$${weeklyMax.toLocaleString()}`}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                  across {matches.length} matched {matches.length === 1 ? "opportunity" : "opportunities"}
                </div>
              </div>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "white",
              }}>
                {matches.length}
              </div>
            </div>

            {/* Matched listings */}
            {matches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>—</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--navy)", marginBottom: 8 }}>No matches found</div>
                <div style={{ fontSize: 14 }}>Try adjusting your answers or <Link href="/orchids/listings" style={{ color: "var(--blue)" }}>browse all listings</Link>.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {matches.map((opp) => {
                  const color = TYPE_COLORS[opp.type] ?? TYPE_COLORS.Blood;
                  return (
                    <div key={opp.id} style={{
                      background: "white", border: "1px solid var(--border)", borderRadius: 10,
                      padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 12, background: color.light, color: color.text, letterSpacing: "0.04em" }}>
                            {opp.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{opp.time}</span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{opp.freq}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{opp.name}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", fontFamily: "'DM Serif Display', serif" }}>{opp.earnLabel}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTAs */}
            <div style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12,
              padding: "28px 32px",
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>
                Ready to book?
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.6 }}>
                Create a free account to schedule appointments, track your earnings, and see your community impact.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href={`/orchids/auth?redirect=/orchids/listings${prefilledZip ? `?zip=${prefilledZip}` : ""}`} style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", padding: "13px", background: "var(--navy)", color: "white",
                    fontSize: 15, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer",
                  }}>
                    Create free account →
                  </button>
                </Link>
                <Link href={`/orchids/map${prefilledZip ? `?zip=${prefilledZip}` : ""}`} style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", padding: "13px", background: "transparent", color: "var(--navy)",
                    fontSize: 14, fontWeight: 500, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer",
                  }}>
                    Browse on map (no account needed)
                  </button>
                </Link>
              </div>
            </div>

            {/* Retake */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={() => { setStep(1); setAge(null); setSex(null); setWeight(null); }}
                style={{ background: "none", border: "none", fontSize: 13, color: "var(--text-muted)", cursor: "pointer", textDecoration: "underline" }}
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        {step !== 1 && step !== "results" && (
          <button
            onClick={() => setStep((s) => (s === 2 ? 1 : 2) as 1 | 2 | 3)}
            style={{ marginTop: 20, background: "none", border: "none", fontSize: 13, color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
