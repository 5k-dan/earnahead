"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { Plus } from "lucide-react";

export default function OpportunityCard({ o }: any) {
  const { plan, addToPlan } = useContext(CartContext);

  const already = plan.find((item: any) => item.id === o.id);

  const handleAdd = () => {
    if (!already) addToPlan(o);
  };

  return (
    <div
      className="surface"
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Top Section */}
      <div style={{ flexGrow: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <h3 style={{ margin: 0 }}>{o.title}</h3>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(168,85,247,0.95)",
            }}
          >
            ${o.payout}
          </div>
        </div>

        <div style={{ opacity: 0.7, marginTop: 6 }}>
          {o.locationName} — {o.city}, {o.state}
        </div>

        {/* Description */}
        <div style={{ marginTop: 14, minHeight: 48 }}>
          {o.description}
        </div>

        {/* Requirements */}
        <div style={{ marginTop: 14, opacity: 0.75 }}>
          {o.requirements?.minAge && (
            <div>Min Age: {o.requirements.minAge}</div>
          )}
          {o.requirements?.maxAge && (
            <div>Max Age: {o.requirements.maxAge}</div>
          )}
          {o.requirements?.gender &&
            o.requirements.gender !== "any" && (
              <div>Gender: {o.requirements.gender}</div>
            )}
          {o.requirements?.requiresValidID && (
            <div>Valid ID required</div>
          )}
          {o.requirements?.requiresHealthScreening && (
            <div>Health screening required</div>
          )}
        </div>
      </div>

      {/* Bottom Section (Button locked to bottom) */}
      <div style={{ marginTop: 20 }}>
        <button
          className="btn btnPrimary"
          onClick={handleAdd}
          disabled={already}
          style={{ width: "100%" }}
        >
          <Plus size={18} />
          {already ? "Added" : "Add to Plan"}
        </button>
      </div>
    </div>
  );
}