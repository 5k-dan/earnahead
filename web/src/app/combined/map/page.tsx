"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const TYPES = [
  { key: "all", label: "All" },
  { key: "plasma", label: "Plasma" },
  { key: "blood", label: "Blood" },
  { key: "research", label: "Research" },
  { key: "egg", label: "Egg" },
  { key: "sperm", label: "Sperm" },
];

const listings = [
  { id: 1, type: "plasma", typeFull: "Plasma", org: "BioLife Plasma Services", address: "2438 N Clark St", comp: "$110", compFull: "$110/session", sessions: "Up to 2× per week", time: "90 min", dist: "0.3", rating: 4.8, reviews: 312, x: 48, y: 32 },
  { id: 2, type: "blood", typeFull: "Blood", org: "American Red Cross — Lincoln Park", address: "1 N. LaSalle St", comp: "$50", compFull: "$50/donation", sessions: "Every 56 days", time: "45 min", dist: "0.8", rating: 4.9, reviews: 1840, x: 60, y: 50 },
  { id: 3, type: "research", typeFull: "Research", org: "Northwestern Medicine Trials", address: "675 N Saint Clair St", comp: "$300", compFull: "$300/session", sessions: "Study-specific", time: "2–4 hrs", dist: "1.2", rating: 4.7, reviews: 88, x: 72, y: 28 },
  { id: 4, type: "plasma", typeFull: "Plasma", org: "Octapharma Plasma", address: "3316 N Broadway St", comp: "$95", compFull: "$95/session", sessions: "Up to 2× per week", time: "75 min", dist: "1.5", rating: 4.6, reviews: 204, x: 38, y: 56 },
  { id: 5, type: "egg", typeFull: "Egg", org: "Midwest Fertility Center", address: "40 S Wabash Ave", comp: "$8K–15K", compFull: "$8K–15K/cycle", sessions: "Per cycle", time: "Multi-week", dist: "1.8", rating: 4.9, reviews: 56, x: 65, y: 68 },
  { id: 6, type: "blood", typeFull: "Blood", org: "Versiti Blood Center", address: "208 S LaSalle St", comp: "$40", compFull: "$40/donation", sessions: "Every 56 days", time: "45 min", dist: "2.1", rating: 4.7, reviews: 420, x: 55, y: 75 },
  { id: 7, type: "research", typeFull: "Research", org: "Rush University Medical Center", address: "1653 W Congress Pkwy", comp: "$150", compFull: "$150/visit", sessions: "3 visits required", time: "1.5 hrs", dist: "2.4", rating: 4.8, reviews: 112, x: 28, y: 72 },
  { id: 8, type: "sperm", typeFull: "Sperm", org: "Fairfax Cryobank — Chicago", address: "20 S Clark St", comp: "$175", compFull: "$175/sample", sessions: "2–3× per month", time: "30 min", dist: "2.9", rating: 4.6, reviews: 78, x: 78, y: 45 },
];

const typeColors: Record<string, string> = {
  plasma: "#C8861A",
  blood: "#9B3333",
  research: "#2A5BA8",
  egg: "#2D7A5A",
  sperm: "#6B4A9B",
};

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialZip = searchParams.get("zip") || "60614";
  const [zip, setZip] = useState(initialZip);
  const [activeType, setActiveType] = useState("all");
  const [selected, setSelected] = useState<number | null>(1);

  const filtered = listings.filter((l) => activeType === "all" || l.type === activeType);
  const selectedListing = listings.find((l) => l.id === selected);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) router.replace(`/combined/map?zip=${zip}`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", paddingTop: 64, background: "var(--bg)" }}>
      {/* Sidebar */}
      <div style={{
        width: 400, flexShrink: 0, height: "100%",
        display: "flex", flexDirection: "column",
        background: "var(--surface)", borderRight: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        {/* Search bar */}
        <div style={{ padding: "20px 20px 0", borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
          <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: 16 }}>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              maxLength={5}
              placeholder="ZIP code"
              style={{
                flex: 1, height: 40, padding: "0 14px",
                background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRight: "none",
                color: "var(--white)", fontSize: 14, outline: "none", fontFamily: "inherit",
              }}
            />
            <button type="submit" style={{
              height: 40, padding: "0 16px", background: "var(--accent)", border: "none",
              color: "#060D18", fontSize: 12, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "inherit",
            }}>Search</button>
          </form>
          {/* Type filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveType(t.key)}
                style={{
                  padding: "5px 12px", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.05em", cursor: "pointer", fontFamily: "inherit",
                  background: activeType === t.key ? "var(--accent)" : "var(--surface-2)",
                  color: activeType === t.key ? "#060D18" : "var(--text-2)",
                  border: `1px solid ${activeType === t.key ? "var(--accent)" : "var(--border-2)"}`,
                  transition: "all 150ms",
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500 }}>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>{filtered.length}</span> opportunities near {initialZip}
          </span>
        </div>

        {/* Listings */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((l) => (
            <div
              key={l.id}
              onClick={() => setSelected(l.id)}
              style={{
                padding: "20px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                background: selected === l.id ? "var(--surface-2)" : "transparent",
                borderLeft: selected === l.id ? `3px solid var(--accent)` : "3px solid transparent",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => {
                if (selected !== l.id) (e.currentTarget as HTMLDivElement).style.background = "rgba(214,208,196,0.03)";
              }}
              onMouseLeave={(e) => {
                if (selected !== l.id) (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: typeColors[l.type], padding: "2px 7px",
                      border: `1px solid ${typeColors[l.type]}40`,
                      background: `${typeColors[l.type]}14`,
                    }}>{l.typeFull}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{l.dist} mi</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--white)", marginBottom: 4, letterSpacing: "-0.01em" }}>
                    {l.org}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 8 }}>{l.address}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{l.time} · {l.sessions}</div>
                </div>
                <div style={{ textAlign: "right", paddingLeft: 16, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--accent)", lineHeight: 1, marginBottom: 3 }}>
                    {l.comp}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>per session</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#08111E" }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(200,134,26,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,134,26,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        {/* "Streets" */}
        {[20, 40, 60, 80].map((pct) => (
          <div key={pct} style={{
            position: "absolute", left: 0, right: 0, top: `${pct}%`,
            height: 1, background: "rgba(200,134,26,0.06)",
          }} />
        ))}
        {[25, 50, 75].map((pct) => (
          <div key={pct} style={{
            position: "absolute", top: 0, bottom: 0, left: `${pct}%`,
            width: 1, background: "rgba(200,134,26,0.06)",
          }} />
        ))}

        {/* Map pins */}
        {filtered.map((l) => {
          const isActive = selected === l.id;
          const color = typeColors[l.type];
          return (
            <div
              key={l.id}
              onClick={() => setSelected(l.id)}
              style={{
                position: "absolute",
                left: `${l.x}%`,
                top: `${l.y}%`,
                transform: "translate(-50%, -100%)",
                cursor: "pointer",
                zIndex: isActive ? 10 : 1,
                transition: "transform 150ms",
              }}
            >
              <div style={{
                padding: "6px 12px",
                background: isActive ? "var(--accent)" : "var(--surface)",
                border: `1px solid ${isActive ? "var(--accent)" : color}`,
                color: isActive ? "#060D18" : color,
                fontSize: 13, fontWeight: 700,
                whiteSpace: "nowrap",
                fontFamily: "'DM Serif Display', serif",
                boxShadow: isActive ? `0 4px 20px ${color}40` : "0 2px 8px rgba(0,0,0,0.4)",
                letterSpacing: "0.01em",
                transform: isActive ? "scale(1.08)" : "scale(1)",
                transition: "all 150ms",
              }}>
                {l.comp}
              </div>
              {/* Pin tail */}
              <div style={{
                width: 0, height: 0, margin: "0 auto",
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `6px solid ${isActive ? "var(--accent)" : color}`,
              }} />
            </div>
          );
        })}

        {/* ZIP label */}
        <div style={{
          position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "var(--surface)", border: "1px solid var(--border-2)",
          padding: "8px 20px", fontSize: 13, color: "var(--text-2)", fontWeight: 500, letterSpacing: "0.03em",
        }}>
          Showing results near <span style={{ color: "var(--white)", fontWeight: 600 }}>{initialZip}</span>
        </div>

        {/* Selected detail panel */}
        {selectedListing && (
          <div style={{
            position: "absolute", bottom: 24, right: 24, width: 340,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}>
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: typeColors[selectedListing.type], padding: "3px 8px",
                border: `1px solid ${typeColors[selectedListing.type]}40`,
                background: `${typeColors[selectedListing.type]}14`,
              }}>{selectedListing.typeFull}</span>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>{selectedListing.dist} mi away</span>
            </div>
            <div style={{ padding: "20px" }}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 22, color: "var(--white)", letterSpacing: "-0.01em", margin: "0 0 6px",
              }}>{selectedListing.org}</h3>
              <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 20 }}>{selectedListing.address}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Compensation", val: selectedListing.compFull, gold: true },
                  { label: "Session length", val: selectedListing.time },
                  { label: "Frequency", val: selectedListing.sessions },
                  { label: "Rating", val: `${selectedListing.rating} (${selectedListing.reviews})` },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: item.gold ? "var(--accent)" : "var(--text)", fontWeight: item.gold ? 600 : 400 }}>{item.val}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push("/combined/dashboard")}
                style={{
                  width: "100%", height: 44,
                  background: "var(--accent)", border: "none",
                  color: "#060D18", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase",
                  fontFamily: "inherit", transition: "opacity 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
              >
                Schedule Appointment →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CombinedMap() {
  return (
    <Suspense fallback={<div style={{ height: "100vh", background: "var(--bg)" }} />}>
      <MapContent />
    </Suspense>
  );
}
