"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ZipMap from "@/components/ZipMap";

const clinics = [
  { id: 1, name: "BioLife Plasma Services", type: "Plasma", earn: "$85", distance: "0.8 mi", time: "90 min", lat: 41.9085, lng: -87.6842, verified: true, address: "1420 N Milwaukee Ave" },
  { id: 2, name: "Lifestream Blood Center", type: "Blood", earn: "$50", distance: "1.2 mi", time: "60 min", lat: 41.8782, lng: -87.6397, verified: true, address: "820 W Jackson Blvd" },
  { id: 3, name: "Northwestern Clinical Trials", type: "Research", earn: "$200", distance: "1.9 mi", time: "4 hrs", lat: 41.8954, lng: -87.6204, verified: true, address: "675 N St Clair St" },
  { id: 4, name: "CSL Plasma", type: "Plasma", earn: "$90", distance: "2.3 mi", time: "90 min", lat: 41.9231, lng: -87.6512, verified: true, address: "2211 N Clark St" },
  { id: 5, name: "American Red Cross", type: "Blood", earn: "$45", distance: "2.8 mi", time: "60 min", lat: 41.8731, lng: -87.6867, verified: true, address: "2200 W Harrison St" },
  { id: 6, name: "Vitalant Blood Center", type: "Blood", earn: "$50", distance: "3.4 mi", time: "60 min", lat: 41.8820, lng: -87.6741, verified: true, address: "1615 W Madison St" },
  { id: 7, name: "New England Cryogenic", type: "Sperm", earn: "$150", distance: "3.9 mi", time: "45 min", lat: 41.8805, lng: -87.6278, verified: true, address: "55 E Monroe St" },
  { id: 8, name: "Shady Grove Fertility", type: "Egg", earn: "$8,500", distance: "4.6 mi", time: "4 wks", lat: 41.9001, lng: -87.6243, verified: true, address: "900 N Michigan Ave" },
];

const typeColors: Record<string, { bg: string; light: string }> = {
  Plasma: { bg: "#1e5aa8", light: "#e8f0f8" },
  Blood: { bg: "#c0392b", light: "#fde8e8" },
  Research: { bg: "#0d1f3c", light: "#e8ecf2" },
  Sperm: { bg: "#5c3d8a", light: "#ede8f5" },
  Egg: { bg: "#2ecc71", light: "#eafaf1" },
};

// Chicago center
const CHICAGO: [number, number] = [-87.6298, 41.8781];

export default function OrchidsMapPage() {
  const [zip, setZip] = useState("60614");
  const [activeId, setActiveId] = useState<number>(clinics[0].id);
  const [filterType, setFilterType] = useState("All");

  const types = ["All", "Blood", "Plasma", "Research", "Sperm", "Egg"];
  const filtered = filterType === "All" ? clinics : clinics.filter(c => c.type === filterType);
  const active = clinics.find(c => c.id === activeId) ?? clinics[0];

  const pins = useMemo(() => filtered.map(c => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    label: c.earn,
    color: typeColors[c.type]?.bg ?? "#1e5aa8",
    active: c.id === activeId,
  })), [filtered, activeId]);

  return (
    <div style={{ paddingTop: 64, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Searching near <strong style={{ color: "var(--navy)" }}>{zip}</strong>
        </div>

        <div style={{ width: 1, height: 32, background: "var(--border)" }} />

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

        <div style={{ marginLeft: "auto" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Within 5 miles of {zip}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{filtered.length} verified opportunities</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 380, flexShrink: 0, background: "white", borderRight: "1px solid var(--border)", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 24px", background: "var(--off-white)", borderBottom: "1px solid var(--border)", display: "flex", gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Potential weekly</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--green)", fontFamily: "'DM Serif Display', serif" }}>$280</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Patients helped/mo</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", fontFamily: "'DM Serif Display', serif" }}>12</div>
            </div>
          </div>

          {filtered.map(clinic => (
            <div key={clinic.id} onClick={() => setActiveId(clinic.id)}
              style={{
                padding: "20px 24px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                background: activeId === clinic.id ? "#f0f4fa" : "white",
                borderLeft: `3px solid ${activeId === clinic.id ? "var(--blue)" : "transparent"}`,
                transition: "background 150ms ease",
              }}
              onMouseEnter={e => { if (activeId !== clinic.id) e.currentTarget.style.background = "var(--off-white)"; }}
              onMouseLeave={e => { if (activeId !== clinic.id) e.currentTarget.style.background = "white"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 3 }}>{clinic.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{clinic.address}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", flexShrink: 0, marginLeft: 12 }}>{clinic.earn}</div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: typeColors[clinic.type]?.light || "var(--gray-100)", color: typeColors[clinic.type]?.bg || "var(--navy)" }}>
                  {clinic.type}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{clinic.distance}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{clinic.time}</span>
                {clinic.verified && (
                  <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--green)", fontWeight: 600 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="5" fill="var(--green)" />
                      <path d="M2.5 5L4 6.5L7.5 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}

          <div style={{ padding: 20, borderTop: "1px solid var(--border)", marginTop: "auto" }}>
            <Link href="/orchids/listings">
              <button style={{ width: "100%", padding: "12px", background: "var(--navy)", color: "white", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer" }}>
                View All Listings →
              </button>
            </Link>
          </div>
        </div>

        {/* Real Mapbox map */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <ZipMap
            center={CHICAGO}
            pins={pins}
            onPinClick={id => setActiveId(id as number)}
            onZipChange={(_, z) => setZip(z)}
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Active clinic popup */}
          {active && (
            <div style={{ position: "absolute", bottom: 24, right: 24, width: 300, background: "white", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", overflow: "hidden", zIndex: 10 }}>
              <div style={{ padding: "16px 20px", background: "var(--navy)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 2 }}>{active.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{active.address}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green-light)", fontFamily: "'DM Serif Display', serif" }}>{active.earn}</div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[{ label: "Type", value: active.type }, { label: "Distance", value: active.distance }, { label: "Time required", value: active.time }, { label: "Provider", value: "Verified ✓" }].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <Link href="/orchids/listings">
                  <button style={{ width: "100%", padding: "10px", background: "var(--navy)", color: "white", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer" }}>
                    View Full Details
                  </button>
                </Link>
              </div>
            </div>
          )}

          <div style={{ position: "absolute", bottom: 24, left: 24, background: "white", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 14px", fontSize: 12, color: "var(--text-muted)", zIndex: 10 }}>
            Showing opportunities within 5 mi
          </div>
        </div>
      </div>
    </div>
  );
}
