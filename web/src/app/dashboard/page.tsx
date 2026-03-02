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
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";

const STATE_MAP: Record<string, string> = {
  GA: "Georgia",
  NY: "New York",
  OH: "Ohio",
  MI: "Michigan",
  IL: "Illinois",
  TX: "Texas",
  PA: "Pennsylvania",
  MA: "Massachusetts",
  MD: "Maryland",
  TN: "Tennessee",
};

export default function DashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const { plan, weeklyPotential } = useContext(CartContext);

  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [filter, setFilter] = useState("all");
  const [userState, setUserState] = useState<string | null>(null);

  // 1️⃣ Get user state from backend
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile?uid=${user.uid}`);
        if (!res.ok) return;

        const data = await res.json();
        setUserState(data?.state || null); // this is "GA"
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // 2️⃣ Load opportunities filtered by FULL state name
  useEffect(() => {
    if (!userState) {
      setOpps([]);
      return;
    }

    const load = async () => {
      try {
        const fullState = STATE_MAP[userState] || userState;

        const q = query(
          collection(db, "opportunities"),
          where("state", "==", fullState),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        const rows: Opportunity[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));

        setOpps(rows);
      } catch (err) {
        console.error("Error loading opportunities:", err);
      }
    };

    load();
  }, [userState]);

  const filtered = useMemo(() => {
    if (filter === "all") return opps;

    if (filter === "gigs") {
      return opps.filter((o) => {
        const t = (o.type || "").toLowerCase();
        return !t.includes("plasma") && !t.includes("clinical");
      });
    }

    return opps.filter((o) =>
      (o.type || "").toLowerCase().includes(filter)
    );
  }, [opps, filter]);

  const planTotal = useMemo(
    () => plan.reduce((s, x) => s + (Number(x.payout) || 0), 0),
    [plan]
  );

  const monthly = useMemo(() => weeklyPotential * 4, [weeklyPotential]);

  if (loading) return null;

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <div className="container">
          <div className="surface" style={{ padding: 22 }}>
            <div style={{ fontWeight: 800 }}>Not signed in.</div>
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
      <EarningsCards
        inPlan={planTotal}
        monthly={monthly}
        weeklyPotential={weeklyPotential}
      />

      <div className="container" style={{ marginTop: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>
              Opportunities in {STATE_MAP[userState] || userState}
            </div>
            <div style={{ marginTop: 6 }}>
              {filtered.length} opportunities
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <OpportunityFilters value={filter} onChange={setFilter} />
            <button
              onClick={() => signOut(auth)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: "#1f2937",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      </div>
    </div>
  );
}