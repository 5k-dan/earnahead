"use client";

import { useState } from "react";
import Link from "next/link";

const stories = [
  { id: 1, name: "Marcus Thompson", location: "Chicago, IL", age: 29, type: "Plasma", headline: "Turning a routine into a calling.", intro: "Marcus started donating plasma to cover rent during a slow month at work. Two years later, it's become one of the most consistent parts of his life — and a meaningful one.", body: ["I remember the first time I walked into BioLife. I didn't tell anyone I was going. It felt personal — like something I was doing quietly for myself. That first check was $85, and I remember thinking, this is easy money. I can do this.", "But something shifted over the months. The nurses started recognizing me. The staff would ask about my week. I started reading about where the plasma actually goes — these patients with rare immune disorders, people who literally cannot survive without plasma infusions. That changed things.", "I've made over $4,000 now. But more than the money, I come in because I feel like I'm doing something that actually matters. It costs me ninety minutes, twice a week. What I give back is part of someone else's survival."], stats: [{ label: "Donations", value: "94" }, { label: "Earned", value: "$6,580" }, { label: "Patients helped", value: "188" }], color: "#1d5fa8", initials: "MT", featured: true },
  { id: 2, name: "Priya Nair", location: "Austin, TX", age: 34, type: "Research", headline: "Science as service.", intro: "After losing her father to a rare autoimmune condition, Priya enrolled in a clinical trial studying similar disorders. She's now participated in four separate studies.", body: ["My father was diagnosed when I was in college. He spent the last three years of his life in clinical trials, hoping something would work. Nothing did. After he passed, I spent a long time thinking about what I could do.", "I found Vitalink when I was looking for research trials in Austin. My first screening was terrifying — the questionnaires, the blood draws, the consent forms. But the team was professional and I felt respected.", "I'm not a scientist. I'm a preschool teacher. But when I walk out of a trial visit, I feel like I've contributed something real to medical knowledge."], stats: [{ label: "Studies completed", value: "4" }, { label: "Earned", value: "$2,800" }, { label: "Conditions researched", value: "3" }], color: "#2d7a5a", initials: "PN", featured: false },
  { id: 3, name: "James Whitfield", location: "Philadelphia, PA", age: 41, type: "Blood", headline: "Every 56 days, like clockwork.", intro: "James has donated blood every 56 days for the past six years. He marks it in his calendar the same way he marks his daughter's school events.", body: ["My daughter had open-heart surgery at four years old. She required three units of blood. We were told, in a very matter-of-fact way, that without blood donors, this operation would not have been possible.", "After she recovered, I found the nearest blood center and made an appointment. That was 2020. I haven't missed a single eligible date since.", "I don't talk about it much. It's not something I need credit for. But I think about how I felt sitting in that waiting room, and I know that somewhere there's another parent feeling exactly that."], stats: [{ label: "Donations", value: "39" }, { label: "Earned", value: "$1,950" }, { label: "Patients helped", value: "117" }], color: "#0d1f3c", initials: "JW", featured: false },
  { id: 4, name: "Sofia Reyes", location: "Los Angeles, CA", age: 26, type: "Egg", headline: "A decision made with care.", intro: "Sofia went through an extensive research process before deciding to donate eggs. She appreciated that Vitalink made it easy to find a clinic with transparent, verified credentials.", body: ["I'd heard stories about egg donation before — some positive, some cautionary. I spent months reading everything I could find.", "When I finally used Vitalink to filter by verified providers, I found Shady Grove. Their screening process was thorough and unhurried.", "The process was medically involved — I won't pretend otherwise. But I was cared for. And now there's a family somewhere that has a child they couldn't have otherwise."], stats: [{ label: "Cycles completed", value: "2" }, { label: "Earned", value: "$17,000" }, { label: "Families helped", value: "2" }], color: "#5c3d8a", initials: "SR", featured: false },
  { id: 5, name: "Derek Osei", location: "Atlanta, GA", age: 23, type: "Sperm", headline: "Responsibility and generosity.", intro: "Derek enrolled in a sperm donor program after thorough consideration of the ethical dimensions. He's now in the final year of a 6-month donor contract.", body: ["This was not a casual decision. I took time to think about what it means — about donor-conceived children and their potential questions someday.", "I chose a clinic that uses identity-release policies, meaning any donor-conceived person can request contact after turning 18. That mattered to me.", "Three times a week for six months. It has given me financial breathing room during grad school, but the more lasting thing is the feeling of having made a considered, values-aligned decision."], stats: [{ label: "Donations completed", value: "52" }, { label: "Earned", value: "$7,800" }, { label: "Policy", value: "ID-release" }], color: "#1d5fa8", initials: "DO", featured: false },
  { id: 6, name: "Alana Park", location: "Seattle, WA", age: 31, type: "Plasma", headline: "Flexibility that fits real life.", intro: "As a freelance illustrator with an irregular schedule, Alana needed income sources she could control. Plasma donation became the most reliable flex income in her portfolio.", body: ["Freelance life means feast and famine. Some months everything is booked. Others are quiet and my savings take a hit.", "Plasma donation is as close to ideal as it gets. I can go early in the morning before client calls. I can skip a week if I'm traveling.", "I've also met some genuinely interesting people in the waiting room. There's a community of regulars at my center — nurses who know your name, people who've been coming for years."], stats: [{ label: "Donations", value: "78" }, { label: "Earned", value: "$5,850" }, { label: "Patients helped", value: "156" }], color: "#2d7a5a", initials: "AP", featured: false },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  Plasma: { bg: "#e8f0f8", text: "#1d5fa8" },
  Blood: { bg: "#fde8e8", text: "#c0392b" },
  Research: { bg: "#e8ecf2", text: "#0d1f3c" },
  Egg: { bg: "#ede8f5", text: "#5c3d8a" },
  Sperm: { bg: "#ede8f5", text: "#5c3d8a" },
};

type Story = typeof stories[0];

function StoryCard({ story, onClick }: { story: Story; onClick: (s: Story) => void }) {
  const color = typeColors[story.type];
  return (
    <div onClick={() => onClick(story)}
      style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "box-shadow 200ms ease, transform 200ms ease" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ height: 160, background: `linear-gradient(135deg, ${story.color}18 0%, ${story.color}08 100%)`, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "28px", gap: 20, position: "relative" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: story.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "white", flexShrink: 0, boxShadow: `0 4px 20px ${story.color}40` }}>
          {story.initials}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 3 }}>{story.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{story.location} · Age {story.age}</div>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: color.bg, color: color.text }}>{story.type}</span>
        </div>
        {story.featured && (
          <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 600, color: "#b8860b", background: "#fef9e7", padding: "3px 10px", borderRadius: 12 }}>Featured</div>
        )}
      </div>
      <div style={{ padding: "24px 28px" }}>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "var(--navy)", marginBottom: 10, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{story.headline}</h3>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {story.intro}
        </p>
        <div style={{ display: "flex", gap: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          {story.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--navy)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryModal({ story, onClose }: { story: Story; onClose: () => void }) {
  const color = typeColors[story.type];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,31,60,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 660, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(13,31,60,0.25)" }}>
        <div style={{ padding: "36px 40px 28px", borderBottom: "1px solid var(--border)", background: `linear-gradient(135deg, ${story.color}0d 0%, white 60%)`, position: "sticky", top: 0, zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: color.bg, color: color.text }}>{story.type} Donor</span>
            <button onClick={onClose} style={{ width: 32, height: 32, border: "1px solid var(--border)", borderRadius: "50%", background: "white", fontSize: 16, color: "var(--gray-500)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: story.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "white", flexShrink: 0 }}>{story.initials}</div>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--navy)", letterSpacing: "-0.02em", marginBottom: 4 }}>{story.name}</h2>
              <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{story.location} · Age {story.age}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "32px 40px" }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--navy)", marginBottom: 20, fontStyle: "italic", letterSpacing: "-0.01em" }}>"{story.headline}"</h3>
          {story.body.map((para, i) => (
            <p key={i} style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 20 }}>{para}</p>
          ))}
          <div style={{ marginTop: 28, padding: "20px", background: "var(--off-white)", borderRadius: 10, display: "flex", gap: 32 }}>
            {story.stats.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--navy)" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 40px 32px", borderTop: "1px solid var(--border)" }}>
          <Link href="/orchids/listings">
            <button onClick={onClose} style={{ padding: "12px 28px", background: "var(--navy)", color: "white", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer" }}>
              Find opportunities like {story.name.split(" ")[0]}'s →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrchidsStories() {
  const [selected, setSelected] = useState<Story | null>(null);
  const [filterType, setFilterType] = useState("All");
  const types = ["All", "Plasma", "Blood", "Research", "Egg", "Sperm"];
  const filtered = filterType === "All" ? stories : stories.filter(s => s.type === filterType);
  const featured = stories.find(s => s.featured)!;

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Hero */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "64px 32px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 14 }}>Contributor Stories</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 }}>
              The people behind<br />every contribution.
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 480 }}>
              Behind every donation is a person with a reason. These are their stories — honest, unfiltered accounts of why they contribute and what it means to them.
            </p>
          </div>

          {/* Featured story */}
          <div onClick={() => setSelected(featured)} style={{ background: "var(--navy)", borderRadius: 14, padding: "32px", cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--green-light)", fontWeight: 600, marginBottom: 20 }}>Featured Story</div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: featured.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0 }}>{featured.initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "white" }}>{featured.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{featured.location}</div>
              </div>
            </div>
            <blockquote style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, fontStyle: "italic", marginBottom: 20 }}>
              "{featured.headline}"
            </blockquote>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 20 }}>
              {featured.intro.slice(0, 120)}...
            </p>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-light)" }}>Read full story →</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{
              padding: "6px 16px", border: `1px solid ${filterType === t ? "var(--navy)" : "var(--border)"}`,
              borderRadius: 20, fontSize: 13, fontWeight: filterType === t ? 600 : 400,
              color: filterType === t ? "var(--navy)" : "var(--gray-500)",
              background: filterType === t ? "var(--gray-100)" : "white", cursor: "pointer",
            }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map(story => <StoryCard key={story.id} story={story} onClick={setSelected} />)}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 32px", background: "var(--navy)", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 3.5vw, 40px)", color: "white", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Add your story to this community.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 36, lineHeight: 1.7 }}>
            Find opportunities near you and start contributing in a way that fits your life.
          </p>
          <Link href="/orchids">
            <button style={{ padding: "14px 32px", background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer" }}>
              Find Opportunities Near You
            </button>
          </Link>
        </div>
      </div>

      {selected && <StoryModal story={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
