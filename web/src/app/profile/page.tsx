"use client";

import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

type Profile = {
  name: string;
  age: string;
  city: string;
  state: string;
};

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext);

  const [profile, setProfile] = useState<Profile>({ name: "", age: "", city: "Atlanta", state: "GA" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data() as any;
        setProfile({
          name: d.name ?? "",
          age: d.age ?? "",
          city: d.city ?? "Atlanta",
          state: d.state ?? "GA",
        });
      }
    };
    load();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    await setDoc(
      doc(db, "users", user.uid),
      {
        ...profile,
        email: user.email,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setSaving(false);
  };

  if (loading) return null;

  return (
    <div>
      <Navbar />
      <div style={{ padding: "26px 0" }}>
        <div className="container">
          <div className="surface" style={{ padding: 22, maxWidth: 720 }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Profile</div>
            <div className="kicker" style={{ marginTop: 6 }}>
              Update your info used for eligibility checks later.
            </div>

            <hr className="hr" style={{ margin: "16px 0" }} />

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div className="kicker" style={{ marginBottom: 6 }}>
                  Name
                </div>
                <input className="input" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
              </div>

              <div>
                <div className="kicker" style={{ marginBottom: 6 }}>
                  Age
                </div>
                <input className="input" value={profile.age} onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))} />
              </div>

              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 140px" }}>
                <div>
                  <div className="kicker" style={{ marginBottom: 6 }}>
                    City
                  </div>
                  <input className="input" value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))} />
                </div>
                <div>
                  <div className="kicker" style={{ marginBottom: 6 }}>
                    State
                  </div>
                  <input className="input" value={profile.state} onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button className="btn btnPrimary" onClick={save} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}