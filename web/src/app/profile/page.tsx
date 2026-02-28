"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("any");
  const [hasValidID, setHasValidID] = useState(false);
  const [hasHealthScreening, setHasHealthScreening] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setAge(data.age || "");
        setGender(data.gender || "any");
        setHasValidID(data.hasValidID || false);
        setHasHealthScreening(data.hasHealthScreening || false);
        setCity(data.city || "");
        setState(data.state || "");
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      age: Number(age),
      gender,
      hasValidID,
      hasHealthScreening,
      city,
      state,
    });

    alert("Profile saved");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: 30 }}>
        <div className="surface" style={{ padding: 24 }}>
          <h2>Profile</h2>

          <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
            <input
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input"
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input"
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={hasValidID}
                onChange={(e) => setHasValidID(e.target.checked)}
              />
              I have a valid government ID
            </label>

            <label>
              <input
                type="checkbox"
                checked={hasHealthScreening}
                onChange={(e) => setHasHealthScreening(e.target.checked)}
              />
              I completed required health screening
            </label>

            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input"
            />

            <input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input"
            />

            <button className="btn btnPrimary" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}