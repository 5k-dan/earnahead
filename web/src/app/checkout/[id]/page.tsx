"use client";

import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { checkEligibility } from "@/lib/eligibility";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: loadingAuth } = useContext(AuthContext);

  const [opportunity, setOpportunity] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (loadingAuth) return;

      if (!user) {
        router.replace("/");
        return;
      }

      if (!id) return;

      const oppRef = doc(db, "opportunities", id as string);
      const userRef = doc(db, "users", user.uid);

      const [oppSnap, userSnap] = await Promise.all([
        getDoc(oppRef),
        getDoc(userRef),
      ]);

      if (oppSnap.exists()) {
        setOpportunity({ id, ...oppSnap.data() });
      }

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }

      setLoading(false);
    };

    loadData();
  }, [user, id, router, loadingAuth]);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!opportunity) {
    return <div style={{ padding: 40 }}>Opportunity not found.</div>;
  }

  if (!profile) {
    return (
      <div style={{ padding: 40 }}>
        <h3>Profile not found.</h3>
        <button
          className="btn btnPrimary"
          style={{ marginTop: 20 }}
          onClick={() => router.push("/profile")}
        >
          Complete Profile
        </button>
      </div>
    );
  }

  const result = checkEligibility(profile, opportunity);

  const mapsQuery = encodeURIComponent(opportunity.address || "");

  return (
    <div>
      <Navbar />
      <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
        <div className="surface" style={{ padding: 32 }}>
          <h2>{opportunity.title}</h2>
          <p style={{ opacity: 0.7 }}>{opportunity.locationName}</p>
          <p style={{ marginTop: 10 }}>${opportunity.payout}</p>

          <p style={{ marginTop: 10, opacity: 0.8 }}>
            {opportunity.address}
          </p>

          <hr style={{ margin: "24px 0", opacity: 0.2 }} />

          {result.eligible ? (
            <>
              <h3 style={{ color: "limegreen" }}>You are eligible</h3>

              {opportunity.signupUrl && (
                <button
                  className="btn btnPrimary"
                  style={{ marginTop: 20 }}
                  onClick={() =>
                    window.open(opportunity.signupUrl, "_blank")
                  }
                >
                  Visit Official Signup Page
                </button>
              )}

              {opportunity.address && (
                <button
                  className="btn"
                  style={{ marginTop: 12 }}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
                      "_blank"
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
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <button
                className="btn"
                style={{ marginTop: 20 }}
                onClick={() => router.push("/profile")}
              >
                Update Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}