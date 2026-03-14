"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

export default function Login() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const cleanEmail = useMemo(() => email.trim(), [email]);
  const canSubmit = cleanEmail.length > 3 && password.length >= 6;

  useEffect(() => {
    if (user && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [user, pathname, router]);

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
        hasValidID: false,
        hasHealthScreening: false,
        gender: "any",
      },
      { merge: true }
    );
    router.replace("/dashboard");
  };

  const login = async () => {
    if (!canSubmit) return;
    await signInWithEmailAndPassword(auth, cleanEmail, password);
    router.replace("/dashboard");
  };

  if (loading) return null;

  return (
    <div style={{ padding: "70px 0" }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="surface" style={{ padding: 26 }}>
          <div className="badge">Sign in to EarnAhead</div>
          <div className="h1" style={{ fontSize: 42 }}>
            Find verified ways to earn near you.
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              placeholder="Password (min 6)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btnPrimary" onClick={signUp} disabled={!canSubmit}>
                Create account
              </button>
              <button className="btn" onClick={login} disabled={!canSubmit}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
