"use client";

import { motion } from "motion/react";
import { DollarSign, Heart, Users, TrendingUp, Calendar, Award, MapPin } from "lucide-react";
import { mockOpportunities } from "@/lib/figma-opportunities";
import Link from "next/link";

const earningsData = [
  { month: "Jan", amount: 180 },
  { month: "Feb", amount: 240 },
  { month: "Mar", amount: 320 },
  { month: "Apr", amount: 280 },
  { month: "May", amount: 420 },
  { month: "Jun", amount: 380 },
];

const recentContributions = [
  { id: 1, type: "Plasma Donation", date: "March 12, 2026", location: "BioLife Plasma Services", amount: 120, patients: 2 },
  { id: 2, type: "Blood Donation", date: "March 8, 2026", location: "Red Cross Blood Center", amount: 75, patients: 3 },
  { id: 3, type: "Medical Research", date: "March 3, 2026", location: "UCSF Medical Center", amount: 250, patients: 10 },
  { id: 4, type: "Plasma Donation", date: "February 28, 2026", location: "CSL Plasma", amount: 100, patients: 2 },
];

const leaderboard = [
  { rank: 1, name: "Sarah M.", contributions: 42, impact: 126 },
  { rank: 2, name: "Michael R.", contributions: 38, impact: 114 },
  { rank: 3, name: "You", contributions: 28, impact: 84, isUser: true },
  { rank: 4, name: "Jennifer L.", contributions: 25, impact: 75 },
  { rank: 5, name: "David K.", contributions: 23, impact: 69 },
];

const maxAmount = Math.max(...earningsData.map(d => d.amount));

function EarningsChart() {
  const width = 600;
  const height = 280;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = earningsData.map((d, i) => ({
    x: padL + (i / (earningsData.length - 1)) * chartW,
    y: padT + chartH - (d.amount / maxAmount) * chartH,
    ...d,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fillD = `${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  const yLabels = [0, 100, 200, 300, 400, maxAmount];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 300 }}>
      <defs>
        <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2E5C8A" stopOpacity="0.15" />
          <stop offset="95%" stopColor="#2E5C8A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLabels.map(val => {
        const y = padT + chartH - (val / maxAmount) * chartH;
        return (
          <g key={val}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#64748B">{val}</text>
          </g>
        );
      })}

      {/* X labels */}
      {points.map(p => (
        <text key={p.month} x={p.x} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748B">{p.month}</text>
      ))}

      {/* Fill area */}
      <path d={fillD} fill="url(#dashGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#2E5C8A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots */}
      {points.map(p => (
        <circle key={p.month} cx={p.x} cy={p.y} r="4" fill="white" stroke="#2E5C8A" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Here's your contribution summary and upcoming opportunities</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: "Total Earned", value: "$1,820", change: "+$420 this month", color: "#6B8E7F" },
            { icon: Heart, label: "Total Contributions", value: "28", change: "4 this month", color: "#2E5C8A" },
            { icon: Users, label: "Patients Helped", value: "84", change: "Estimated impact", color: "#6B8E7F" },
            { icon: TrendingUp, label: "Community Rank", value: "#3", change: "Top 5% locally", color: "#2E5C8A" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg border border-border"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: stat.color + "1a" }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Earnings Overview</h3>
                  <p className="text-sm text-muted-foreground">Last 6 months</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">$1,820</p>
                  <p className="text-sm text-accent">+23% from last period</p>
                </div>
              </div>
              <EarningsChart />
            </motion.div>

            {/* Recent Contributions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg border border-border"
            >
              <h3 className="text-lg font-semibold mb-6">Recent Contributions</h3>

              <div className="space-y-4">
                {recentContributions.map((contribution) => (
                  <div key={contribution.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Heart className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">{contribution.type}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {contribution.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {contribution.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary mb-1">${contribution.amount}</p>
                      <p className="text-sm text-accent">{contribution.patients} patients helped</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Opportunities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg border border-border"
            >
              <h3 className="text-lg font-semibold mb-4">Recommended This Week</h3>

              <div className="space-y-4">
                {mockOpportunities.slice(0, 3).map((opp) => (
                  <div key={opp.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{opp.name}</p>
                        <p className="text-xs text-muted-foreground">{opp.distance} miles away</p>
                      </div>
                      <p className="font-semibold text-accent">${opp.compensation}</p>
                    </div>
                    <button className="w-full mt-2 py-2 bg-muted hover:bg-muted/80 text-foreground rounded text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              <Link href="/figma/discover/94102">
                <button className="w-full mt-4 py-2.5 bg-secondary text-white rounded-md font-medium hover:bg-secondary/90 transition-colors">
                  Browse All Opportunities
                </button>
              </Link>
            </motion.div>

            {/* Community Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-lg border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Community Leaders</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Top contributors this month</p>

              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between py-2 px-3 rounded ${entry.isUser ? "bg-accent/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1 ? "bg-accent text-white" :
                        entry.rank === 2 ? "bg-secondary/20 text-secondary" :
                        entry.rank === 3 ? "bg-accent/20 text-accent" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.contributions} contributions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-accent">{entry.impact}</p>
                      <p className="text-xs text-muted-foreground">helped</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weekly Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-secondary to-secondary/80 p-6 rounded-lg text-white"
            >
              <h3 className="text-lg font-semibold mb-2">Weekly Goal</h3>
              <p className="text-white/80 text-sm mb-4">You're 75% toward your $400 goal</p>

              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-white rounded-full h-2" style={{ width: "75%" }}></div>
              </div>

              <p className="text-2xl font-bold mb-4">$300 / $400</p>

              <Link href="/figma/discover/94102">
                <button className="w-full py-2.5 bg-white text-secondary rounded-md font-medium hover:bg-white/90 transition-colors">
                  Find More Opportunities
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
