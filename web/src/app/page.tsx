"use client";

import { useContext, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const cleanEmail = useMemo(() => email.trim(), [email]);
  const canSubmit = cleanEmail.length > 3 && password.length >= 6;

  const signUp = async () => {
    if (!canSubmit) return;
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);

    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        email: cred.user.email,
        role: "user",
        createdAt: serverTimestamp(),
        name: "",
        age: "",
        city: "Atlanta",
        state: "GA",
      },
      { merge: true }
    );

    router.push("/dashboard");
  };

  const login = async () => {
    if (!canSubmit) return;
    await signInWithEmailAndPassword(auth, cleanEmail, password);
    router.push("/dashboard");
  };

  if (loading) return null;

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div style={{ padding: "70px 0" }}>
      <div className="container" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr", alignItems: "start" }}>
        <div className="surface" style={{ padding: 26, maxWidth: 520 }}>
          <div className="badge">Sign in to EarnAhead</div>
          <div className="h1" style={{ fontSize: 42 }}>
            Find verified ways to earn near you.
          </div>
          <div className="sub">
            Donations, research studies, and regulated opportunities — organized in one hub.
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" placeholder="Password (min 6)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button className="btn btnPrimary" onClick={signUp} disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.6 }}>
                Create account
              </button>
              <button className="btn" onClick={login} disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.6 }}>
                Login
              </button>
            </div>

            <div style={{ color: "rgba(255,255,255,0.52)", fontSize: 13 }}>
              Tip: use a real email format. Trim spaces automatically.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}