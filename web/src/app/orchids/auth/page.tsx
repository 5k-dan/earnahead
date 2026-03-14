"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/orchids/dashboard";

  // Already logged in
  useEffect(() => {
    if (!loading && user) {
      // If signed in but unverified, send to verify page
      if (!user.emailVerified) {
        router.replace("/orchids/auth/verify");
      } else {
        router.replace(redirect);
      }
    }
  }, [user, loading, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        // onAuthStateChanged will trigger the useEffect above to redirect
      } else {
        if (!name.trim()) { setError("Please enter your name."); setSubmitting(false); return; }
        await signUp(email, password, name.trim());
        // After signup, send to verify page (email not yet verified)
        router.replace("/orchids/auth/verify");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Incorrect email or password.");
      } else if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("weak-password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 15,
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 8,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--navy)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
      {/* Logo */}
      <Link href="/orchids" style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 28,
        color: "white",
        textDecoration: "none",
        marginBottom: 48,
        display: "block",
      }}>
        Vitalink
      </Link>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "40px 36px",
      }}>
        {/* Mode toggle */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 8,
          padding: 4,
          marginBottom: 32,
        }}>
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 150ms ease",
                background: mode === m ? "var(--blue)" : "transparent",
                color: mode === m ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Name field — signup only */}
          {mode === "signup" && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(192,57,43,0.15)",
              border: "1px solid rgba(192,57,43,0.4)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#f1948a",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "13px 0",
              background: submitting ? "rgba(30,90,168,0.5)" : "var(--blue)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 150ms ease",
              marginTop: 4,
            }}
          >
            {submitting
              ? (mode === "signin" ? "Signing in…" : "Creating account…")
              : (mode === "signin" ? "Sign In" : "Create Account")}
          </button>
        </form>
      </div>

      {/* Back link */}
      <Link href="/orchids" style={{
        marginTop: 24,
        fontSize: 13,
        color: "rgba(255,255,255,0.35)",
        textDecoration: "none",
      }}>
        ← Back to Vitalink
      </Link>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
