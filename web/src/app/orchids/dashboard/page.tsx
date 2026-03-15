"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const recentContributions = [
  { date: "Mar 12, 2026", type: "Plasma", clinic: "BioLife Plasma Services", earn: "+$85", patients: 2 },
  { date: "Mar 8, 2026", type: "Plasma", clinic: "BioLife Plasma Services", earn: "+$85", patients: 2 },
  { date: "Feb 28, 2026", type: "Blood", clinic: "Lifestream Blood Center", earn: "+$50", patients: 3 },
  { date: "Feb 22, 2026", type: "Plasma", clinic: "CSL Plasma", earn: "+$90", patients: 2 },
  { date: "Feb 15, 2026", type: "Research", clinic: "Northwestern Clinical Trials", earn: "+$200", patients: 0 },
];

const weeklyPlan = [
  { day: "Mon", task: "BioLife Plasma", time: "10:00 AM", earn: "$85", confirmed: true },
  { day: "Thu", task: "BioLife Plasma", time: "9:30 AM", earn: "$85", confirmed: true },
  { day: "Sat", task: "Lifestream Blood (optional)", time: "Walk-in", earn: "$50", confirmed: false },
];

const leaderboard = [
  { rank: 1, name: "Sarah K.", city: "Chicago, IL", donations: 142, earned: "$9,840", impact: 284 },
  { rank: 2, name: "David M.", city: "Austin, TX", donations: 128, earned: "$8,960", impact: 256 },
  { rank: 3, name: "You", city: "Chicago, IL", donations: 47, earned: "$3,240", impact: 94, isUser: true },
  { rank: 4, name: "Emma R.", city: "Boston, MA", donations: 44, earned: "$3,080", impact: 88 },
  { rank: 5, name: "Marcus T.", city: "Detroit, MI", donations: 38, earned: "$2,660", impact: 76 },
];

const typeColors: Record<string, { bg: string; light: string; text: string }> = {
  Plasma: { bg: "var(--blue)", light: "#e8f0f8", text: "#1d5fa8" },
  Blood: { bg: "#c0392b", light: "#fde8e8", text: "#c0392b" },
  Research: { bg: "var(--navy)", light: "#e8ecf2", text: "var(--navy)" },
};

const earningsHistory = [
  { value: 310 }, { value: 395 }, { value: 280 }, { value: 460 },
  { value: 510 }, { value: 420 }, { value: 580 }, { value: 620 },
];
const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const maxEarn = Math.max(...earningsHistory.map(d => d.value));

export default function OrchidsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading } = useAuth();
  const router = useRouter();

  // Auth guard — redirect to login if not signed in, or verify page if unverified
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/orchids/auth?redirect=/orchids/dashboard");
    } else if (!user.emailVerified) {
      router.replace("/orchids/auth/verify");
    }
  }, [user, loading, router]);

  if (loading || !user || !user.emailVerified) {
    return (
      <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--off-white)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--blue)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user.displayName?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "32px 32px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Contributor Dashboard</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "var(--navy)", letterSpacing: "-0.02em" }}>{greeting}, {firstName}.</h1>
            </div>
            <Link href="/orchids/listings">
              <button style={{ padding: "10px 22px", background: "var(--navy)", color: "white", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer" }}>
                Find New Opportunities
              </button>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {["overview", "history", "schedule", "leaderboard"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "10px 20px", background: "transparent", border: "none",
                borderBottom: `2px solid ${activeTab === tab ? "var(--navy)" : "transparent"}`,
                fontSize: 14, fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "var(--navy)" : "var(--gray-500)",
                cursor: "pointer", textTransform: "capitalize",
              }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { label: "Total Earned", value: "$3,240", sub: "+$620 this month", positive: true },
            { label: "Donations Made", value: "47", sub: "6 this month", positive: true },
            { label: "Patients Helped", value: "94", sub: "estimated lifetime", positive: false },
            { label: "Community Rank", value: "#3", sub: "in Chicago, IL", positive: false },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "24px", background: "white", border: "1px solid var(--border)", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{stat.label}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, color: "var(--navy)", lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: stat.positive ? "var(--green)" : "var(--text-muted)", fontWeight: 500 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Earnings chart */}
              <div style={{ padding: "24px", background: "white", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>Monthly Earnings</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Last 8 months</div>
                  </div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--green)" }}>$620</div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "0 4px" }}>
                  {earningsHistory.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: "100%", height: `${(d.value / maxEarn) * 80}px`, background: i === earningsHistory.length - 1 ? "var(--blue)" : "var(--gray-200)", borderRadius: "3px 3px 0 0" }} />
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{months[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent contributions */}
              <div style={{ padding: "24px", background: "white", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 20 }}>Recent Contributions</div>
                {recentContributions.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < recentContributions.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: typeColors[c.type]?.light || "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: typeColors[c.type]?.text || "var(--navy)", flexShrink: 0 }}>
                        {c.type.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>{c.clinic}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.date}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>{c.earn}</div>
                      {c.patients > 0 && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.patients} patients helped</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Weekly plan */}
              <div style={{ padding: "24px", background: "white", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>This Week's Plan</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Recommended based on your history</div>
                {weeklyPlan.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < weeklyPlan.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: p.confirmed ? "var(--navy)" : "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: p.confirmed ? "white" : "var(--gray-400)", flexShrink: 0 }}>
                        {p.day}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--navy)" }}>{p.task}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.time}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{p.earn}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px", background: "var(--green-pale)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 500 }}>This week's potential</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--green)" }}>$220</span>
                </div>
              </div>

              {/* Lifetime impact */}
              <div style={{ padding: "24px", background: "var(--navy)", borderRadius: 10, color: "white" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Your Lifetime Impact</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Estimated contributions to healthcare</div>
                {[
                  { label: "Plasma donations", value: "38" },
                  { label: "Blood donations", value: "7" },
                  { label: "Research studies", value: "2" },
                  { label: "Patients helped (est.)", value: "94" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>Community Contributors</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Ranked by lifetime impact in your region</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 120px 100px", padding: "12px 28px", background: "var(--off-white)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
              <span>Rank</span><span>Contributor</span><span>Donations</span><span>Total Earned</span><span>Patients</span>
            </div>
            {leaderboard.map(row => (
              <div key={row.rank} style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 120px 100px", padding: "18px 28px", borderBottom: "1px solid var(--border)", background: row.isUser ? "rgba(29,95,168,0.04)" : "white", borderLeft: row.isUser ? "3px solid var(--blue)" : "3px solid transparent" }}>
                <span style={{ fontSize: row.rank <= 2 ? 16 : 14, fontWeight: 700, color: row.rank === 1 ? "#b8860b" : row.rank === 2 ? "#777" : "var(--navy)", fontFamily: "'DM Serif Display', serif" }}>
                  {row.rank === 1 ? "1st" : row.rank === 2 ? "2nd" : `#${row.rank}`}
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: row.isUser ? 700 : 500, color: "var(--navy)" }}>
                    {row.name} {row.isUser && <span style={{ fontSize: 11, color: "var(--blue)", fontWeight: 600 }}>— You</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{row.city}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{row.donations}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green)" }}>{row.earned}</span>
                <span style={{ fontSize: 14, color: "var(--navy)" }}>{row.impact}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 100px 80px", padding: "12px 24px", background: "var(--off-white)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
              <span>Date</span><span>Provider</span><span>Type</span><span>Earned</span><span>Impact</span>
            </div>
            {recentContributions.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 100px 80px", padding: "16px 24px", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.date}</span>
                <span style={{ fontWeight: 500, color: "var(--navy)" }}>{c.clinic}</span>
                <span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: typeColors[c.type]?.light || "var(--gray-100)", color: typeColors[c.type]?.text || "var(--navy)" }}>
                    {c.type}
                  </span>
                </span>
                <span style={{ fontWeight: 700, color: "var(--green)" }}>{c.earn}</span>
                <span style={{ color: "var(--text-muted)" }}>{c.patients > 0 ? `${c.patients} pts` : "—"}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "28px" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>Upcoming Schedule</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Your confirmed donation appointments</div>
            {weeklyPlan.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderBottom: i < weeklyPlan.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 56, height: 56, background: p.confirmed ? "var(--navy)" : "var(--gray-100)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.confirmed ? "white" : "var(--gray-400)" }}>{p.day}</span>
                  <span style={{ fontSize: 10, color: p.confirmed ? "rgba(255,255,255,0.6)" : "var(--gray-300)" }}>Mar 2026</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{p.task}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.time}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", fontFamily: "'DM Serif Display', serif" }}>{p.earn}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: p.confirmed ? "var(--green)" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {p.confirmed ? "Confirmed" : "Optional"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
