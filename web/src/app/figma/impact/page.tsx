"use client";

import { motion } from "motion/react";
import { TrendingUp, Users, Heart, Award, MapPin } from "lucide-react";

const cityStats = [
  { city: "San Francisco", contributions: 4234, earnings: 892000 },
  { city: "Oakland", contributions: 2891, earnings: 615000 },
  { city: "San Jose", contributions: 3456, earnings: 734000 },
  { city: "Berkeley", contributions: 1823, earnings: 412000 },
  { city: "Palo Alto", contributions: 1567, earnings: 389000 },
];

const typeDistribution = [
  { name: "Blood", value: 3245, color: "#2E5C8A" },
  { name: "Plasma", value: 2834, color: "#6B8E7F" },
  { name: "Research", value: 1923, color: "#94A3B8" },
  { name: "Sperm", value: 567, color: "#475569" },
  { name: "Egg", value: 234, color: "#334155" },
];

const monthlyTrend = [
  { month: "Jan", blood: 520, plasma: 450, research: 280 },
  { month: "Feb", blood: 580, plasma: 520, research: 310 },
  { month: "Mar", blood: 640, plasma: 580, research: 340 },
  { month: "Apr", blood: 690, plasma: 620, research: 370 },
  { month: "May", blood: 750, plasma: 680, research: 410 },
  { month: "Jun", blood: 810, plasma: 740, research: 450 },
];

const topContributors = [
  { name: "Sarah Martinez", city: "San Francisco", contributions: 42, impact: 126 },
  { name: "Michael Roberts", city: "Oakland", contributions: 38, impact: 114 },
  { name: "Jennifer Lee", city: "San Jose", contributions: 35, impact: 105 },
  { name: "David Kim", city: "Berkeley", contributions: 32, impact: 96 },
  { name: "Amanda Chen", city: "Palo Alto", contributions: 30, impact: 90 },
];

const totalDistribution = typeDistribution.reduce((sum, t) => sum + t.value, 0);
const maxMonthly = Math.max(...monthlyTrend.map(m => m.blood + m.plasma + m.research));

function BarChart() {
  const barW = 14;
  const gap = 4;
  const groupW = barW * 3 + gap * 2 + 16;
  const width = monthlyTrend.length * groupW + 60;
  const height = 280;
  const padB = 30;
  const padL = 40;
  const chartH = height - padB - 16;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 320 }}>
      {/* Y axis guides */}
      {[0, 250, 500, 750, 1000].map(v => {
        const y = 16 + chartH - (v / maxMonthly) * chartH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={width} y2={y} stroke="#E2E8F0" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="10" fill="#64748B">{v}</text>
          </g>
        );
      })}

      {monthlyTrend.map((m, i) => {
        const x = padL + i * groupW;
        const bh = (v: number) => (v / maxMonthly) * chartH;
        const by = (v: number) => 16 + chartH - bh(v);

        return (
          <g key={m.month}>
            <rect x={x} y={by(m.blood)} width={barW} height={bh(m.blood)} fill="#2E5C8A" rx="3" />
            <rect x={x + barW + gap} y={by(m.plasma)} width={barW} height={bh(m.plasma)} fill="#6B8E7F" rx="3" />
            <rect x={x + barW * 2 + gap * 2} y={by(m.research)} width={barW} height={bh(m.research)} fill="#94A3B8" rx="3" />
            <text x={x + barW * 1.5 + gap} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748B">{m.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart() {
  const r = 70;
  const cx = 120;
  const cy = 110;
  let cumAngle = -90;

  const arcs = typeDistribution.map(t => {
    const angle = (t.value / totalDistribution) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const end = cumAngle;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const large = angle > 180 ? 1 : 0;
    const innerR = 46;
    const ix1 = cx + innerR * Math.cos(toRad(start));
    const iy1 = cy + innerR * Math.sin(toRad(start));
    const ix2 = cx + innerR * Math.cos(toRad(end));
    const iy2 = cy + innerR * Math.sin(toRad(end));
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`, color: t.color };
  });

  return (
    <svg viewBox="0 0 240 220" className="w-full" style={{ height: 200 }}>
      {arcs.map((arc, i) => <path key={i} d={arc.d} fill={arc.color} />)}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#0A1628">8,803</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#64748B">total</text>
    </svg>
  );
}

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Impact</h1>
          <p className="text-muted-foreground">Visualizing the collective contribution to healthcare in the Bay Area</p>
        </motion.div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Active Contributors", value: "12,847", change: "+1,234 this month" },
            { icon: Heart, label: "Total Contributions", value: "48,392", change: "+3,892 this month" },
            { icon: TrendingUp, label: "Patients Helped", value: "145,176", change: "Estimated impact" },
            { icon: Award, label: "Total Earned", value: "$3.2M", change: "+$284K this month" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg border border-border"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-accent">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Monthly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 bg-white p-6 rounded-lg border border-border"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1">Contribution Trends</h3>
              <p className="text-sm text-muted-foreground">Monthly breakdown by type (Last 6 months)</p>
            </div>

            <BarChart />

            <div className="flex items-center justify-center gap-8 mt-2">
              {[
                { label: "Blood", color: "#2E5C8A" },
                { label: "Plasma", color: "#6B8E7F" },
                { label: "Research", color: "#94A3B8" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg border border-border"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">By Type</h3>
              <p className="text-sm text-muted-foreground">Distribution breakdown</p>
            </div>

            <DonutChart />

            <div className="space-y-2 mt-2">
              {typeDistribution.map((type) => (
                <div key={type.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-muted-foreground">{type.name}</span>
                  </div>
                  <span className="font-medium">{type.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* City Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg border border-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Regional Breakdown</h3>
            </div>

            <div className="space-y-4">
              {cityStats.map((city) => (
                <div key={city.city} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{city.city}</span>
                    <span className="text-sm text-muted-foreground">{city.contributions.toLocaleString()} contributions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-muted rounded-full h-2 mr-4">
                      <div
                        className="bg-secondary rounded-full h-2"
                        style={{ width: `${(city.contributions / cityStats[0].contributions) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-accent">${(city.earnings / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <div className="text-right">
                  <p className="font-bold text-primary">{cityStats.reduce((sum, c) => sum + c.contributions, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">contributions</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-lg border border-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Top Contributors</h3>
            </div>

            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-accent text-white" :
                      index === 1 ? "bg-secondary/20 text-secondary" :
                      index === 2 ? "bg-accent/20 text-accent" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-sm text-muted-foreground">{contributor.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{contributor.contributions}</p>
                    <p className="text-sm text-accent">{contributor.impact} helped</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-secondary to-secondary/80 p-12 rounded-lg text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Together, we're making a difference</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Our community has contributed to saving and improving over 145,000 lives through verified healthcare donations and research participation.
          </p>
          <div className="flex items-center justify-center gap-12">
            {[
              { value: "48,392", label: "Total Donations" },
              { value: "145K+", label: "Lives Impacted" },
              { value: "$3.2M", label: "Earned by Contributors" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-12">
                {i > 0 && <div className="w-px h-16 bg-white/20" />}
                <div>
                  <p className="text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
