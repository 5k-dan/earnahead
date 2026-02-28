"use client";

import { DollarSign, CalendarDays, Target, TrendingUp } from "lucide-react";

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="surface2" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 14,
            background: "rgba(168,85,247,0.14)",
            border: "1px solid rgba(168,85,247,0.22)",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </div>
        <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>{label}</div>
      </div>

      <div style={{ marginTop: 10, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ marginTop: 2, color: "rgba(255,255,255,0.50)", fontSize: 13 }}>{sub}</div>
    </div>
  );
}

export default function EarningsCards({
  inPlan,
  monthly,
  weeklyPotential,
}: {
  inPlan: number;
  monthly: number;
  weeklyPotential: number;
}) {
  return (
    <div className="container" style={{ marginTop: 14 }}>
      <div className="grid grid4">
        <StatCard icon={<DollarSign size={18} />} label="In Your Plan" value={`$${inPlan}`} sub="estimated total" />
        <StatCard icon={<CalendarDays size={18} />} label="This Month" value={`$${monthly}`} sub="projected" />
        <StatCard icon={<Target size={18} />} label="Weekly Potential" value={`$${weeklyPotential || 0}`} sub="based on plan" />
        <StatCard icon={<TrendingUp size={18} />} label="Trend" value="Up" sub="vs last month" />
      </div>
    </div>
  );
}