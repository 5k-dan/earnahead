"use client";

import { useContext } from "react";
import Navbar from "@/components/Navbar";
import { CartContext } from "@/context/CartContext";

export default function CartPage() {
  const { plan, removeFromPlan, clearPlan, weeklyPotential } = useContext(CartContext);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "26px 0" }}>
        <div className="container">
          <div className="surface" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Your Plan</div>
                <div className="kicker" style={{ marginTop: 6 }}>
                  Weekly potential: ${weeklyPotential}
                </div>
              </div>
              <button className="btn" onClick={clearPlan} style={{ opacity: plan.length ? 1 : 0.6 }} disabled={!plan.length}>
                Clear plan
              </button>
            </div>

            <hr className="hr" style={{ margin: "16px 0" }} />

            {plan.length === 0 ? (
              <div className="sub">No items yet. Go add opportunities.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {plan.map((o) => (
                  <div key={o.id} className="surface2" style={{ padding: 16, display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 900 }}>{o.title}</div>
                      <div className="kicker" style={{ marginTop: 6 }}>
                        {o.locationName} — {o.city}, {o.state} • {o.type}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900, fontSize: 18, color: "rgba(168,85,247,0.95)" }}>${o.payout}</div>
                      <button className="btn" onClick={() => removeFromPlan(o.id)} style={{ marginTop: 10 }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}