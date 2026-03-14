"use client";

import { useState } from "react";

const typeColors: Record<string, string> = {
  plasma: "#C8861A",
  blood: "#9B3333",
  research: "#2A5BA8",
  egg: "#2D7A5A",
  sperm: "#6B4A9B",
};

const stories = [
  {
    id: 1,
    type: "plasma",
    typeFull: "Plasma",
    name: "Marcus T.",
    location: "Chicago, IL",
    tenure: "2 years",
    headline: "I didn't know my body could do that.",
    summary: "Started donating plasma to make ends meet. Earned over $9,000 and helped an estimated 60 patients.",
    earned: "$9,200",
    sessions: "184",
    impact: "~60 patients",
    featured: true,
    body: [
      "I lost my job in the spring of 2022 and needed income fast. A friend mentioned plasma donation — I was skeptical, but I needed the money. My first session at BioLife on Clark Street felt strange. You're sitting there, watching your blood leave and come back, and you're thinking: is this real?",
      "Then I got paid. $110 for 90 minutes. I went back three days later. Then twice the following week. By the end of the month, I had $440 — which covered my phone bill, groceries, and part of rent.",
      "What I didn't expect was how it would make me feel. The staff at BioLife told me my plasma was used to treat people with rare immune disorders — people for whom this was life-saving treatment. I started to see it differently. I wasn't just earning money. I was doing something that mattered.",
      "Two years later, I have a full-time job again. I still donate plasma twice a week. Not because I need the income — I do it because I've seen firsthand what it does. The $9,200 I've earned has been real. But the 60-odd patients my donations have helped — that's the number I think about.",
    ],
  },
  {
    id: 2,
    type: "egg",
    typeFull: "Egg Donation",
    name: "Priya M.",
    location: "Boston, MA",
    tenure: "1 cycle",
    headline: "A family exists that wouldn't have otherwise.",
    summary: "Donated eggs at 26, received $12,000. A family she'll never meet is now complete.",
    earned: "$12,000",
    sessions: "1 cycle",
    impact: "1 family",
    featured: false,
    body: [
      "I was 26, healthy, and the compensation was meaningful — I was paying off graduate school debt. But I want to be honest: the process is more involved than a plasma donation. Multiple doctor visits, hormone injections, an egg retrieval procedure. It takes weeks.",
      "Midwest Fertility Center was thorough and professional. They walked me through every step, and when I had questions — even at 11pm — someone answered. I never felt like a transaction.",
      "The retrieval itself was uncomfortable but not painful. Recovery took a weekend. And then it was done, and I had $12,000, and somewhere in the country, someone was going through IVF with part of me.",
      "I don't know who that family is. I don't need to. What I know is that a child exists, or will exist, because I said yes. That's enough.",
    ],
  },
  {
    id: 3,
    type: "research",
    typeFull: "Clinical Research",
    name: "James O.",
    location: "Philadelphia, PA",
    tenure: "8 months",
    headline: "They're studying a drug that could help millions.",
    summary: "Participated in three clinical trials at Penn Medicine. Earned $2,100 and contributed to treatments in development.",
    earned: "$2,100",
    sessions: "3 studies",
    impact: "Potential millions",
    featured: false,
    body: [
      "I've always been interested in medicine. I'm not a doctor — I work in logistics — but I read about clinical trials, and when I found out I could get paid to participate, I wanted to understand what that actually means.",
      "My first study at Penn Medicine was for a blood pressure medication. Three visits, a lot of blood draws, and $650. The consent forms were long. I read them. That's important — you need to read them.",
      "What struck me was how human the researchers were. They explained exactly what they were measuring and why. They wanted to know if I had questions. One of the lead investigators told me the molecule they were studying had shown promise in 12% of participants with a specific genetic marker. I didn't have that marker, but I could still help them understand the baseline.",
      "I've done three studies now. Total earned: $2,100. More importantly, I've contributed data that will be part of FDA submissions. That's real. That means something.",
    ],
  },
  {
    id: 4,
    type: "blood",
    typeFull: "Blood",
    name: "Carla D.",
    location: "Seattle, WA",
    tenure: "4 years",
    headline: "My blood type is rare. That changes things.",
    summary: "AB-negative donor who has given 28 times over four years. Her blood type is compatible with all patients.",
    earned: "$1,400",
    sessions: "28",
    impact: "84+ lives",
    featured: false,
    body: [
      "I'm AB-negative. That means my plasma is universal — it can be given to any patient regardless of blood type. When I found that out, it stopped being optional.",
      "I've donated 28 times over four years. That's 84 potential lives — the math is one donation can help up to three people. I don't do this for the $50. I do it because when you have something rare and useful, you give it.",
      "The Versiti center near my office is efficient and friendly. Appointments take 45 minutes. You bring a book. It's not a big deal operationally, but it has a big impact.",
      "My advice to anyone thinking about it: get tested. Find out your blood type. If you're AB-negative, you're already special. Show up.",
    ],
  },
  {
    id: 5,
    type: "sperm",
    typeFull: "Sperm",
    name: "Derek N.",
    location: "Austin, TX",
    tenure: "14 months",
    headline: "The screening process made me take my own health seriously.",
    summary: "Donated at Fairfax Cryobank for over a year. The health screenings caught a vitamin D deficiency he'd had for years.",
    earned: "$4,200",
    sessions: "24",
    impact: "In progress",
    featured: false,
    body: [
      "I almost didn't do it. The application process for sperm donation is extensive — health history, genetic screening, family background. I filled out the forms half-expecting to be disqualified.",
      "I wasn't. But the screening showed I had a significant vitamin D deficiency I'd been unaware of for years. The doctor at the cryobank flagged it, referred me to my GP, and I've been on supplements for 14 months now. I feel noticeably better. That alone was worth it.",
      "The donation process itself is private and clinical. The staff are professional. You're compensated per accepted sample, so there's variability — some months I earned $300, some months $250. Over 14 months: $4,200.",
      "What I think about is that somewhere, children will exist who share half my genetics. That's a strange feeling. I read everything I could about what that means legally and emotionally. I'm at peace with it. But you should think about it carefully before you start.",
    ],
  },
  {
    id: 6,
    type: "plasma",
    typeFull: "Plasma",
    name: "Aisha R.",
    location: "Denver, CO",
    tenure: "18 months",
    headline: "My daughter is the reason I started. Now she's the reason I continue.",
    summary: "Single mother who discovered plasma donation during a difficult financial stretch. Now maintains it as supplemental income.",
    earned: "$5,800",
    sessions: "112",
    impact: "~40 patients",
    featured: false,
    body: [
      "I'm a single mother. My daughter was four when I started donating plasma. I needed $300 a month to close the gap between my salary and my expenses. A colleague told me about BioLife.",
      "I remember the first time I brought my daughter to wait in the parking lot — I couldn't afford childcare that day. She sat in the car with a tablet and snacks while I went in for 90 minutes and came out with $110. She asked what I did in there. I told her I was helping doctors make medicine. Which is true.",
      "18 months later, my financial situation has stabilized. My daughter is in school. I still donate twice a week. It's become part of my routine — my own health checkup, consistent supplemental income, and something that benefits people I'll never meet.",
      "She's nine now. She knows what I do. She told her teacher her mom 'makes medicine with her blood.' That's not wrong.",
    ],
  },
];

const typeFilters = [
  { key: "all", label: "All" },
  { key: "plasma", label: "Plasma" },
  { key: "blood", label: "Blood" },
  { key: "research", label: "Research" },
  { key: "egg", label: "Egg" },
  { key: "sperm", label: "Sperm" },
];

export default function CombinedStories() {
  const [activeType, setActiveType] = useState("all");
  const [modalId, setModalId] = useState<number | null>(null);

  const filtered = stories.filter((s) => activeType === "all" || s.type === activeType);
  const modal = stories.find((s) => s.id === modalId);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 20 }}>
            Community Stories
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end" }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(40px, 4.5vw, 60px)",
              color: "var(--white)", letterSpacing: "-0.025em", lineHeight: 1.05, margin: 0,
            }}>
              Real people.<br />
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Real contributions.</em>
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.8, margin: 0 }}>
              Every donor has a reason. Every session has a story.
              These are the people who show up — and the difference it makes for them and for others.
            </p>
          </div>
        </div>
      </div>

      {/* Featured story */}
      {stories.find((s) => s.featured) && (() => {
        const f = stories.find((s) => s.featured)!;
        return (
          <div
            style={{ background: "var(--bg)", padding: "0 48px", cursor: "pointer" }}
            onClick={() => setModalId(f.id)}
          >
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{
                marginTop: "-1px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderTop: "none",
                display: "grid", gridTemplateColumns: "1fr 1fr",
                overflow: "hidden",
              }}>
                <div style={{ padding: "52px 52px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                      color: typeColors[f.type], padding: "3px 10px",
                      border: `1px solid ${typeColors[f.type]}40`,
                      background: `${typeColors[f.type]}14`,
                    }}>{f.typeFull.toUpperCase()}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>Featured</span>
                  </div>
                  <h2 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(26px, 3vw, 40px)",
                    color: "var(--white)", letterSpacing: "-0.02em", lineHeight: 1.2,
                    margin: "0 0 20px", fontStyle: "italic",
                  }}>
                    "{f.headline}"
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.78, marginBottom: 36 }}>
                    {f.body[0].slice(0, 200)}...
                  </p>
                  <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.04em" }}>
                    Read the full story →
                  </span>
                </div>
                <div style={{
                  background: "var(--surface-3)",
                  borderLeft: "1px solid var(--border)",
                  padding: "52px 48px",
                  display: "flex", flexDirection: "column", justifyContent: "center", gap: 0,
                }}>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)", marginBottom: 4 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>{f.location} · {f.tenure} active · {f.sessions} sessions</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {[
                      { label: "Total earned", value: f.earned },
                      { label: "Sessions", value: f.sessions },
                      { label: "Impact", value: f.impact },
                      { label: "Type", value: f.typeFull },
                    ].map((item) => (
                      <div key={item.label}>
                        <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{item.label}</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "var(--accent)", lineHeight: 1 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Filter + grid */}
      <div style={{ padding: "72px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}>
            <span style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 8, fontWeight: 600 }}>
              Filter
            </span>
            {typeFilters.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveType(t.key)}
                style={{
                  padding: "6px 16px", fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.04em", cursor: "pointer", fontFamily: "inherit",
                  background: activeType === t.key ? "var(--accent)" : "transparent",
                  color: activeType === t.key ? "#060D18" : "var(--text-2)",
                  border: `1px solid ${activeType === t.key ? "var(--accent)" : "var(--border-2)"}`,
                  transition: "all 150ms",
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* Story grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {filtered.filter((s) => !s.featured).map((s) => (
              <div
                key={s.id}
                onClick={() => setModalId(s.id)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  padding: "36px 32px", cursor: "pointer",
                  transition: "background 150ms, border-color 150ms",
                  borderTop: `3px solid ${typeColors[s.type]}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = typeColors[s.type];
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    color: typeColors[s.type], padding: "2px 8px",
                    border: `1px solid ${typeColors[s.type]}40`,
                    background: `${typeColors[s.type]}14`,
                  }}>{s.typeFull.toUpperCase()}</span>
                </div>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22, color: "var(--white)", letterSpacing: "-0.01em",
                  lineHeight: 1.3, margin: "0 0 16px", fontStyle: "italic",
                }}>
                  "{s.headline}"
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 28 }}>{s.summary}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{s.location}</div>
                  </div>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--accent)" }}>{s.earned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(4, 8, 15, 0.88)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setModalId(null)}
        >
          <div
            style={{
              background: "var(--surface)", border: "1px solid var(--border-2)",
              maxWidth: 760, width: "100%", maxHeight: "90vh",
              overflowY: "auto", position: "relative",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              position: "sticky", top: 0, background: "var(--surface)",
              borderBottom: "1px solid var(--border)", padding: "20px 32px",
              display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                  color: typeColors[modal.type], padding: "3px 8px",
                  border: `1px solid ${typeColors[modal.type]}40`,
                  background: `${typeColors[modal.type]}14`,
                }}>{modal.typeFull.toUpperCase()}</span>
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>{modal.name} · {modal.location}</span>
              </div>
              <button
                onClick={() => setModalId(null)}
                style={{
                  background: "none", border: "none", color: "var(--text-2)",
                  fontSize: 20, cursor: "pointer", padding: "4px 8px", lineHeight: 1,
                }}
              >×</button>
            </div>

            {/* Modal content */}
            <div style={{ padding: "40px 48px" }}>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "var(--white)", letterSpacing: "-0.02em",
                lineHeight: 1.25, margin: "0 0 40px", fontStyle: "italic",
              }}>
                "{modal.headline}"
              </h2>
              {modal.body.map((para, i) => (
                <p key={i} style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.85, marginBottom: 24 }}>{para}</p>
              ))}
              {/* Stats row */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                borderTop: "1px solid var(--border)", paddingTop: 32, marginTop: 8,
              }}>
                {[
                  { label: "Total earned", value: modal.earned },
                  { label: "Sessions", value: modal.sessions },
                  { label: "Community impact", value: modal.impact },
                ].map((item) => (
                  <div key={item.label} style={{ paddingLeft: 0, paddingRight: 24 }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--accent)", lineHeight: 1 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
