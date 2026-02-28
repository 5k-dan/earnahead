"use client";

import { useContext, useMemo } from "react";
import { CartContext, Opportunity } from "@/context/CartContext";
import { BadgeCheck, MapPin, Clock, Plus } from "lucide-react";

function typePill(type: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("plasma")) return { text: "Medical", bg: "rgba(168,85,247,0.14)", bd: "rgba(168,85,247,0.22)" };
  if (t.includes("sperm") || t.includes("egg")) return { text: "Medical", bg: "rgba(168,85,247,0.14)", bd: "rgba(168,85,247,0.22)" };
  if (t.includes("clinical")) return { text: "Research", bg: "rgba(236,72,153,0.14)", bd: "rgba(236,72,153,0.22)" };
  return { text: "Gigs", bg: "rgba(96,165,250,0.14)", bd: "rgba(96,165,250,0.22)" };
}

export default function OpportunityCard({ o }: { o: Opportunity }) {
  const { addToPlan, plan } = useContext(CartContext);

  const already = useMemo(() => plan.some((x) => x.id === o.id), [plan, o.id]);
  const pill = typePill(o.type);

  return (
    <div className="surface2" style={{ padding: 18, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -2,
          background: "radial-gradient(450px 180px at 20% 0%, rgba(168,85,247,0.14), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: "-0.01em" }}>{o.title}</div>
            <div style={{ marginTop: 6, display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: pill.bg,
                  border: `1px solid ${pill.bd}`,
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 12,
                }}
              >
                <BadgeCheck size={14} />
                {pill.text}
              </span>

              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{o.type}</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "rgba(168,85,247,0.95)" }}>${o.payout}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>total</div>
          </div>
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{o.description}</div>

        <div style={{ marginTop: 14, display: "grid", gap: 8, color: "rgba(255,255,255,0.62)", fontSize: 13 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <MapPin size={16} />
            {o.locationName} — {o.city}, {o.state}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Clock size={16} />
            Requirements: {o.requirements}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button
            className={"btn " + (already ? "" : "btnPrimary")}
            onClick={() => addToPlan(o)}
            disabled={already}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, opacity: already ? 0.7 : 1 }}
          >
            <Plus size={18} />
            {already ? "Added" : "Add to Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}