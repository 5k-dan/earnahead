"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EarningsCards from "@/components/EarningsCards";
import OpportunityCard from "@/components/OpportunityCard";
import OpportunityFilters from "@/components/OpportunityFilters";
import { AuthContext } from "@/context/AuthContext";
import { CartContext, Opportunity } from "@/context/CartContext";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const { plan, weeklyPotential } = useContext(CartContext);

  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "opportunities"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const rows: Opportunity[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setOpps(rows);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return opps;

    if (filter === "gigs") {
      // treat anything not plasma/clinical as gigs if you want later
      return opps.filter((o) => {
        const t = (o.type || "").toLowerCase();
        return !t.includes("plasma") && !t.includes("clinical");
      });
    }

    return opps.filter((o) => (o.type || "").toLowerCase().includes(filter));
  }, [opps, filter]);

  const planTotal = useMemo(() => plan.reduce((s, x) => s + (Number(x.payout) || 0), 0), [plan]);
  const monthly = useMemo(() => weeklyPotential * 4, [weeklyPotential]);

  if (loading) return null;

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <div className="container">
          <div className="surface" style={{ padding: 22 }}>
            <div style={{ fontWeight: 800 }}>Not signed in.</div>
            <div className="sub" style={{ marginTop: 8 }}>
              Go to the home page to log in.
            </div>
            <div style={{ marginTop: 14 }}>
              <Link className="btn btnPrimary" href="/">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <HeroSection weeklyPotential={weeklyPotential || 320} />

      <EarningsCards inPlan={planTotal} monthly={monthly} weeklyPotential={weeklyPotential} />

      <div className="container" id="opps" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="h2" style={{ fontWeight: 900 }}>
              Near You
            </div>
            <div className="kicker" style={{ marginTop: 6 }}>
              {filtered.length} opportunities
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <OpportunityFilters value={filter} onChange={setFilter} />
            <button className="btn" onClick={() => signOut(auth)} style={{ marginLeft: 10 }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
            alignItems: "stretch",
        }}
        >
        {filtered.map((o) => (
            <div key={o.id} style={{ display: "flex" }}>
            <OpportunityCard o={o} />
            </div>
        ))}
        </div>
      </div>
    </div>
  );
}