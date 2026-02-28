"use client";

import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { checkEligibility } from "@/lib/eligibility";

export default function CheckoutPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [opportunity, setOpportunity] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !id) return;

      const oppRef = doc(db, "opportunities", id as string);
      const userRef = doc(db, "users", user.uid);

      const oppSnap = await getDoc(oppRef);
      const userSnap = await getDoc(userRef);

      if (oppSnap.exists()) {
        setOpportunity({ id, ...oppSnap.data() });
      }

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }

      setLoading(false);
    };

    loadData();
  }, [user, id]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!opportunity) return <div style={{ padding: 40 }}>Opportunity not found.</div>;
  if (!profile) return <div style={{ padding: 40 }}>Profile not found.</div>;

  const result = checkEligibility(profile, opportunity);

  return (
    <div>
      <Navbar />
      <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
        <div className="surface" style={{ padding: 32 }}>
          <h2 style={{ marginBottom: 10 }}>{opportunity.title}</h2>
          <p style={{ opacity: 0.7 }}>{opportunity.locationName}</p>
          <p style={{ fontSize: 20, marginTop: 10 }}>
            ${opportunity.payout}
          </p>

          <hr style={{ margin: "24px 0", opacity: 0.2 }} />

          {result.eligible ? (
            <>
              <h3 style={{ color: "limegreen" }}>You are eligible</h3>

              {opportunity.latitude && opportunity.longitude && (
                <button
                  className="btn btnPrimary"
                  style={{ marginTop: 20 }}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${opportunity.latitude},${opportunity.longitude}`
                    )
                  }
                >
                  Get Directions
                </button>
              )}
            </>
          ) : (
            <>
              <h3 style={{ color: "red" }}>You are not eligible</h3>
              <ul style={{ marginTop: 15 }}>
                {result.missing.map((item: string, i: number) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}