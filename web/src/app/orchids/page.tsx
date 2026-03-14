"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const stats = [
  { value: "142,000", label: "Verified opportunities" },
  { value: "$4.2M", label: "Paid to contributors" },
  { value: "89,000", label: "Patients helped" },
  { value: "2,400", label: "Partner clinics" },
];

const howItWorks = [
  { step: "01", title: "Enter your ZIP code", desc: "We scan verified clinics, donation centers, and research institutions near you." },
  { step: "02", title: "Review opportunities", desc: "See compensation, eligibility requirements, time commitment, and provider credentials." },
  { step: "03", title: "Schedule and contribute", desc: "Book directly through Vitalink and track your earnings and community impact." },
];

const categories = [
  { name: "Blood Donation", freq: "Every 56 days", earn: "Up to $50/visit", icon: "◈" },
  { name: "Plasma Donation", freq: "Twice weekly", earn: "$50–$100/visit", icon: "◉" },
  { name: "Sperm Donation", icon: "◎", freq: "Up to 3×/week", earn: "$100–$200/visit" },
  { name: "Egg Donation", freq: "Per cycle", earn: "$5,000–$15,000", icon: "◍" },
  { name: "Medical Research", freq: "Varies", earn: "$50–$2,000", icon: "◑" },
];

const testimonials = [
  { name: "Marcus T.", location: "Chicago, IL", text: "I've donated plasma twice a week for the past year. It fits around my schedule, helps people, and has earned me over $4,000.", initials: "MT", color: "#1d5fa8" },
  { name: "Priya N.", location: "Austin, TX", text: "Participating in a clinical trial felt daunting until I found Vitalink. Every provider here is fully vetted. I felt safe the entire time.", initials: "PN", color: "#2d7a5a" },
  { name: "James W.", location: "Philadelphia, PA", text: "The dashboard helped me realize I've contributed to helping 14 patients. That motivation keeps me going every week.", initials: "JW", color: "#0d1f3c" },
];

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.2 });
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

function StatCard({ stat, active }: { stat: typeof stats[0]; active: boolean }) {
  const raw = parseInt(stat.value.replace(/\D/g, ""));
  const prefix = stat.value.startsWith("$") ? "$" : "";
  const suffix = stat.value.match(/[A-Z]/) ? stat.value.match(/[A-Z]/)![0] : "";
  const num = useCountUp(raw, active);
  const formatted = num >= 1000 ? num.toLocaleString() : num;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: "white", lineHeight: 1, marginBottom: 8 }}>
        {prefix}{formatted}{suffix}
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{stat.label}</div>
    </div>
  );
}

export default function OrchidsLanding() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [focused, setFocused] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length >= 3) router.push(`/orchids/map?zip=${zip}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 120,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(29,95,168,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(45,122,90,0.15)", border: "1px solid rgba(45,122,90,0.3)", borderRadius: 20, marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, background: "var(--green-light)", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: 13, color: "var(--green-light)", fontWeight: 500, letterSpacing: "0.04em" }}>2,400+ verified healthcare providers</span>
            </div>

            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(42px, 6vw, 68px)", lineHeight: 1.08, color: "white", marginBottom: 24, letterSpacing: "-0.02em" }}>
              Earn while contributing<br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>to your community's health.</em>
            </h1>

            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 48, maxWidth: 520, fontWeight: 300 }}>
              Vitalink connects you with verified donation opportunities — blood, plasma, and medical research — at trusted clinics near you.
            </p>

            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", gap: 12, maxWidth: 460 }}>
                <div style={{
                  flex: 1,
                  border: `1px solid ${focused ? "rgba(29,95,168,0.8)" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  transition: "border-color 200ms ease",
                  overflow: "hidden",
                }}>
                  <input
                    type="text"
                    value={zip}
                    onChange={e => setZip(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Enter ZIP code"
                    maxLength={5}
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", padding: "14px 18px", fontSize: 16, color: "white", letterSpacing: "0.1em" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ padding: "14px 28px", background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--blue-light)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--blue)")}
                >
                  Find Opportunities
                </button>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 12 }}>No account required to browse. All providers are verified.</p>
            </form>
          </div>

          {/* Preview card */}
          <div style={{
            position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)",
            width: 320, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: 28, backdropFilter: "blur(16px)",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Within 5 miles of 60614</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: "white", lineHeight: 1.1, marginBottom: 4 }}>8 opportunities</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>at verified donation centers</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Potential earnings / week</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "var(--green-light)" }}>$280</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Estimated patients helped</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>12</span>
              </div>
            </div>
            <Link href="/orchids/map">
              <button style={{ marginTop: 20, width: "100%", padding: "11px", background: "var(--blue)", color: "white", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer" }}>
                View on Map →
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: "0.08em" }}>
          <span>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
      </section>

      {/* Stats band */}
      <section ref={statsRef} style={{ background: "var(--navy-mid)", padding: "56px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {stats.map(s => <StatCard key={s.label} stat={s} active={statsInView} />)}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "100px 32px", background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>How it works</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: "var(--navy)", letterSpacing: "-0.02em", maxWidth: 500, lineHeight: 1.2 }}>
              Three steps from intent to impact.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {howItWorks.map((item, i) => (
              <div key={i} style={{ padding: "40px", background: "white", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: "var(--gray-200)", lineHeight: 1, marginBottom: 20 }}>{item.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--navy)", marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>Contribution types</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Choose how you contribute.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ padding: "28px 24px", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", transition: "border-color 200ms ease, box-shadow 200ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue-muted)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 24, marginBottom: 16, color: "var(--navy)" }}>{cat.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{cat.freq}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green)" }}>{cat.earn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>Contributor stories</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Real people. Real impact.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: "36px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--off-white)" }}>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "white", flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section style={{ padding: "100px 32px", background: "var(--navy)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-light)", fontWeight: 600, marginBottom: 16 }}>Safety & verification</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 20 }}>
            Every provider is vetted.<br />Every opportunity is verified.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 56px" }}>
            We manually verify each clinic and research institution against federal and state licensing databases before listing them.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { label: "State licensed", desc: "All facilities hold active state healthcare licenses" },
              { label: "FDA registered", desc: "Blood and plasma centers comply with FDA donation standards" },
              { label: "IRB approved", desc: "Research studies carry Institutional Review Board approval" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "28px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textAlign: "left" }}>
                <div style={{ width: 32, height: 32, background: "var(--green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "white", marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 32px", background: "var(--off-white)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 48px)", color: "var(--navy)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Ready to find opportunities near you?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 40, lineHeight: 1.7 }}>
            Enter your ZIP code to see verified donation opportunities, estimated earnings, and your potential community impact.
          </p>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, justifyContent: "center", maxWidth: 400, margin: "0 auto" }}>
            <input
              type="text"
              value={zip}
              onChange={e => setZip(e.target.value)}
              placeholder="ZIP code"
              maxLength={5}
              style={{ flex: 1, padding: "14px 18px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 16, outline: "none", color: "var(--navy)", letterSpacing: "0.1em" }}
            />
            <button type="submit" style={{ padding: "14px 24px", background: "var(--navy)", color: "white", fontSize: 15, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer" }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "48px 32px", background: "var(--navy)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "white" }}>Vitalink</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>© 2026 Vitalink. Built to strengthen communities.</div>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            {["Privacy", "Terms", "Safety"].map(l => (
              <span key={l} style={{ color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
