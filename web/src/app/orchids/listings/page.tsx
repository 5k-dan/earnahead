"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const listings = [
  { id: 1, type: "Plasma", name: "BioLife Plasma Services", address: "1420 N Milwaukee Ave, Chicago, IL", distance: "0.8 mi", compensation: "$85 per visit", frequency: "Up to 2× per week", weeklyPotential: "$680/month", time: "90 minutes", eligibility: ["18–65 years old", "Weight 110+ lbs", "Valid photo ID", "No recent tattoos (4 months)"], badges: ["State Licensed", "FDA Registered"], slots: "Next available: Tomorrow 9:00 AM" },
  { id: 2, type: "Blood", name: "Lifestream Blood Center", address: "820 W Jackson Blvd, Chicago, IL", distance: "1.2 mi", compensation: "$50 per donation", frequency: "Every 56 days", weeklyPotential: "$50 every 8 weeks", time: "60 minutes", eligibility: ["17+ years old", "Weight 110+ lbs", "No cold/flu symptoms", "Well-rested, hydrated"], badges: ["State Licensed", "AABB Accredited"], slots: "Next available: Today 2:30 PM" },
  { id: 3, type: "Research", name: "Northwestern Clinical Trials Unit", address: "675 N St Clair St, Chicago, IL", distance: "1.9 mi", compensation: "$200 per visit", frequency: "4 visits over 6 weeks", weeklyPotential: "$800 total", time: "4 hours per visit", eligibility: ["21–55 years old", "No major health conditions", "No smoking (6 months)", "Must complete screening"], badges: ["IRB Approved", "FDA Registered", "Academic Institution"], slots: "Screening closes in 12 days" },
  { id: 4, type: "Plasma", name: "CSL Plasma", address: "2211 N Clark St, Chicago, IL", distance: "2.3 mi", compensation: "$90 per visit", frequency: "Up to 2× per week", weeklyPotential: "$720/month", time: "90 minutes", eligibility: ["18–65 years old", "Weight 110+ lbs", "Valid government ID", "Permanent address required"], badges: ["State Licensed", "FDA Registered"], slots: "Next available: Tomorrow 11:00 AM" },
  { id: 5, type: "Sperm", name: "New England Cryogenic Center", address: "55 E Monroe St, Chicago, IL", distance: "3.9 mi", compensation: "$150 per donation", frequency: "Up to 3× per week", weeklyPotential: "$1,800/month", time: "45 minutes", eligibility: ["18–39 years old", "College-educated preferred", "No hereditary conditions", "Commitment to 6-month contract"], badges: ["State Licensed", "ASRM Member"], slots: "Applications reviewed weekly" },
  { id: 6, type: "Egg", name: "Shady Grove Fertility", address: "900 N Michigan Ave, Chicago, IL", distance: "4.6 mi", compensation: "$8,500 per cycle", frequency: "1–2 cycles per year", weeklyPotential: "$8,500 per cycle", time: "4–6 week cycle", eligibility: ["21–32 years old", "BMI 18–29", "Non-smoker", "Psychological screening required"], badges: ["State Licensed", "ASRM Member", "IRB Approved"], slots: "Accepting applications now" },
  { id: 7, type: "Blood", name: "American Red Cross", address: "2200 W Harrison St, Chicago, IL", distance: "2.8 mi", compensation: "$45 per donation", frequency: "Every 56 days", weeklyPotential: "$45 every 8 weeks", time: "60 minutes", eligibility: ["16+ with parental consent", "Weight 110+ lbs", "Feel well", "No recent travel to malaria regions"], badges: ["State Licensed", "AABB Accredited", "National Organization"], slots: "Walk-ins accepted daily" },
];

const typeColors: Record<string, { bg: string; text: string; light: string }> = {
  Plasma: { bg: "var(--blue)", text: "#1d5fa8", light: "#e8f0f8" },
  Blood: { bg: "#c0392b", text: "#c0392b", light: "#fde8e8" },
  Research: { bg: "var(--navy)", text: "var(--navy)", light: "#e8ecf2" },
  Sperm: { bg: "#5c3d8a", text: "#5c3d8a", light: "#ede8f5" },
  Egg: { bg: "var(--green)", text: "var(--green)", light: "var(--green-pale)" },
};

type Listing = typeof listings[0];

function ListingRow({ listing }: { listing: Listing }) {
  const [expanded, setExpanded] = useState(false);
  const color = typeColors[listing.type] || typeColors.Plasma;

  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", transition: "box-shadow 150ms ease" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ padding: "24px 28px", cursor: "pointer" }} onClick={() => setExpanded(v => !v)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12, background: color.light, color: color.text, letterSpacing: "0.04em" }}>
                {listing.type.toUpperCase()}
              </span>
              {listing.badges.slice(0, 2).map(b => (
                <span key={b} style={{ fontSize: 11, color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="var(--green-pale)" />
                    <path d="M2.5 5L4 6.5L7.5 3" stroke="var(--green)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>{listing.name}</h3>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{listing.address}</div>
            <div style={{ display: "flex", gap: 24 }}>
              {[["Distance", listing.distance], ["Time required", listing.time], ["Frequency", listing.frequency], ["Availability", listing.slots]].map(([label, val]) => (
                <div key={label as string}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: label === "Availability" ? "var(--blue)" : "var(--navy)" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--green)", lineHeight: 1 }}>
              {listing.compensation.split(" ")[0]}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              {listing.compensation.split(" ").slice(1).join(" ")}
            </div>
            <div style={{ fontSize: 12, color: "var(--navy)", fontWeight: 600, marginBottom: 16 }}>{listing.weeklyPotential}</div>
            <Link href="/orchids/dashboard">
              <button style={{ padding: "9px 18px", background: "var(--navy)", color: "white", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", display: "block", marginBottom: 8, width: "100%" }}
                onClick={e => e.stopPropagation()}
              >
                Schedule →
              </button>
            </Link>
            <button
              onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
              style={{ padding: "7px 18px", background: "transparent", color: "var(--gray-500)", fontSize: 13, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", width: "100%" }}
            >
              {expanded ? "Less ↑" : "Eligibility ↓"}
            </button>
          </div>
        </div>

        {expanded && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>Eligibility Requirements</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {listing.eligibility.map(req => (
                <div key={req} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 20, fontSize: 13, color: "var(--text-secondary)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="var(--blue)" />
                    <path d="M2.5 5L4 6.5L7.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {req}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {listing.badges.map(b => (
                <span key={b} style={{ fontSize: 12, color: "var(--navy)", fontWeight: 600, padding: "4px 12px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--off-white)" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrchidsListings() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") ?? "All";
  const [filterType, setFilterType] = useState(urlType);
  const [sortBy, setSortBy] = useState("distance");
  const types = ["All", "Blood", "Plasma", "Research", "Sperm", "Egg"];

  const filtered = listings
    .filter(l => filterType === "All" || l.type === filterType)
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "compensation") return parseInt(b.compensation.replace(/[$,]/g, "")) - parseInt(a.compensation.replace(/[$,]/g, ""));
      return 0;
    });

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--off-white)" }}>
      <div style={{ background: "var(--navy)", padding: "48px 32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
            ZIP 60614 · Within 5 miles
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "white", letterSpacing: "-0.02em", marginBottom: 8 }}>
            Verified Opportunities Near You
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>
            {filtered.length} opportunities · Potential earnings up to $280/week
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 20px" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{
                padding: "6px 14px", border: `1px solid ${filterType === t ? "var(--navy)" : "var(--border)"}`,
                borderRadius: 20, fontSize: 13, fontWeight: filterType === t ? 600 : 400,
                color: filterType === t ? "var(--navy)" : "var(--gray-500)",
                background: filterType === t ? "var(--gray-100)" : "white", cursor: "pointer",
              }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, color: "var(--navy)", background: "white", outline: "none", cursor: "pointer" }}>
              <option value="distance">Distance</option>
              <option value="compensation">Compensation</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(listing => <ListingRow key={listing.id} listing={listing} />)}
        </div>
      </div>
    </div>
  );
}
