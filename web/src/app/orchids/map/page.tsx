"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const clinics = [
  { id: 1, name: "BioLife Plasma Services", type: "Plasma", earn: "$85", distance: "0.8 mi", time: "90 min", top: 38, left: 42, verified: true, address: "1420 N Milwaukee Ave" },
  { id: 2, name: "Lifestream Blood Center", type: "Blood", earn: "$50", distance: "1.2 mi", time: "60 min", top: 28, left: 58, verified: true, address: "820 W Jackson Blvd" },
  { id: 3, name: "Northwestern Clinical Trials", type: "Research", earn: "$200", distance: "1.9 mi", time: "4 hrs", top: 52, left: 64, verified: true, address: "675 N St Clair St" },
  { id: 4, name: "CSL Plasma", type: "Plasma", earn: "$90", distance: "2.3 mi", time: "90 min", top: 22, left: 30, verified: true, address: "2211 N Clark St" },
  { id: 5, name: "American Red Cross", type: "Blood", earn: "$45", distance: "2.8 mi", time: "60 min", top: 65, left: 48, verified: true, address: "2200 W Harrison St" },
  { id: 6, name: "Vitalant Blood Center", type: "Blood", earn: "$50", distance: "3.4 mi", time: "60 min", top: 44, left: 78, verified: true, address: "1615 W Madison St" },
  { id: 7, name: "New England Cryogenic", type: "Sperm", earn: "$150", distance: "3.9 mi", time: "45 min", top: 70, left: 25, verified: true, address: "55 E Monroe St" },
  { id: 8, name: "Shady Grove Fertility", type: "Egg", earn: "$8,500", distance: "4.6 mi", time: "4 wks", top: 18, left: 72, verified: true, address: "900 N Michigan Ave" },
];

const typeColors: Record<string, { bg: string; light: string }> = {
  Plasma: { bg: "var(--blue)", light: "#e8f0f8" },
  Blood: { bg: "#c0392b", light: "#fde8e8" },
  Research: { bg: "var(--navy)", light: "#e8ecf2" },
  Sperm: { bg: "#5c3d8a", light: "#ede8f5" },
  Egg: { bg: "var(--green)", light: "var(--green-pale)" },
};

type Clinic = typeof clinics[0];

function MapPinEl({ clinic, isActive, onClick }: { clinic: Clinic; isActive: boolean; onClick: (c: Clinic) => void }) {
  const color = typeColors[clinic.type]?.bg || "var(--blue)";
  return (
    <div onClick={() => onClick(clinic)} style={{ position: "absolute", top: `${clinic.top}%`, left: `${clinic.left}%`, transform: "translate(-50%, -100%)", cursor: "pointer", zIndex: isActive ? 10 : 5 }}>
      <div style={{
        background: isActive ? "var(--navy)" : color,
        color: "white", fontSize: 11, fontWeight: 700,
        padding: "4px 10px", borderRadius: 20,
        border: `2px solid ${isActive ? "white" : "rgba(255,255,255,0.6)"}`,
        boxShadow: isActive ? "0 4px 20px rgba(13,31,60,0.4)" : "0 2px 8px rgba(0,0,0,0.18)",
        whiteSpace: "nowrap", transition: "all 150ms ease",
        transform: isActive ? "scale(1.1)" : "scale(1)",
      }}>
        {clinic.earn}
      </div>
      <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${isActive ? "var(--navy)" : color}`, margin: "0 auto" }} />
    </div>
  );
}

export default function OrchidsMapPage() {
  const router = useRouter();
  const [zip, setZip] = useState("60614");
  const [inputZip, setInputZip] = useState("60614");
  const [active, setActive] = useState<Clinic>(clinics[0]);
  const [filterType, setFilterType] = useState("All");

  const types = ["All", "Blood", "Plasma", "Research", "Sperm", "Egg"];
  const filtered = filterType === "All" ? clinics : clinics.filter(c => c.type === filterType);

  return (
    <div style={{ paddingTop: 64, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
        <form onSubmit={e => { e.preventDefault(); setZip(inputZip); }} style={{ display: "flex", gap: 8 }}>
          <input value={inputZip} onChange={e => setInputZip(e.target.value)} maxLength={5}
            style={{ padding: "8px 14px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 14, outline: "none", width: 120, letterSpacing: "0.08em", color: "var(--navy)" }} />
          <button type="submit" style={{ padding: "8px 16px", background: "var(--navy)", color: "white", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer" }}>Update</button>
        </form>

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
            <div key={clinic.id} onClick={() => setActive(clinic)}
              style={{
                padding: "20px 24px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                background: active?.id === clinic.id ? "#f0f4fa" : "white",
                borderLeft: `3px solid ${active?.id === clinic.id ? "var(--blue)" : "transparent"}`,
                transition: "background 150ms ease",
              }}
              onMouseEnter={e => { if (active?.id !== clinic.id) e.currentTarget.style.background = "var(--off-white)"; }}
              onMouseLeave={e => { if (active?.id !== clinic.id) e.currentTarget.style.background = "white"; }}
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

        {/* Map */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "#dde4ec", backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          {[18, 35, 52, 70, 84].map(v => <div key={v} style={{ position: "absolute", top: `${v}%`, left: 0, right: 0, height: v % 17 === 0 ? 4 : 2, background: "rgba(255,255,255,0.85)" }} />)}
          {[12, 28, 44, 60, 76, 90].map(v => <div key={v} style={{ position: "absolute", left: `${v}%`, top: 0, bottom: 0, width: v % 16 === 0 ? 4 : 2, background: "rgba(255,255,255,0.85)" }} />)}
          {[{ top: 20, left: 14, w: 12, h: 12 }, { top: 36, left: 30, w: 12, h: 14 }, { top: 55, left: 45, w: 12, h: 12 }, { top: 22, left: 62, w: 10, h: 10 }, { top: 42, left: 80, w: 8, h: 10 }].map((b, i) => (
            <div key={i} style={{ position: "absolute", top: `${b.top}%`, left: `${b.left}%`, width: `${b.w}%`, height: `${b.h}%`, background: "rgba(200,210,225,0.5)", borderRadius: 2 }} />
          ))}

          {filtered.map(clinic => (
            <MapPinEl key={clinic.id} clinic={clinic} isActive={active?.id === clinic.id} onClick={setActive} />
          ))}

          {active && (
            <div style={{ position: "absolute", bottom: 24, right: 24, width: 300, background: "white", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
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

          <div style={{ position: "absolute", bottom: 24, left: 24, background: "white", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 14px", fontSize: 12, color: "var(--text-muted)" }}>
            Showing opportunities within 5 mi
          </div>
        </div>
      </div>
    </div>
  );
}
