"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const { user, loading, resendVerification, signOut } = useAuth();
  const router = useRouter();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMsg, setResendMsg] = useState("");
  const [checking, setChecking] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/orchids/auth");
    }
  }, [user, loading, router]);

  // Redirect if already verified
  useEffect(() => {
    if (!loading && user?.emailVerified) {
      router.replace("/orchids/dashboard");
    }
  }, [user, loading, router]);

  // Poll for verification every 4 seconds
  useEffect(() => {
    if (!user || user.emailVerified) return;
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          router.replace("/orchids/dashboard");
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [user, router]);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleResend = async () => {
    try {
      await resendVerification();
      setResendMsg("Email sent!");
      setResendCooldown(60);
      setTimeout(() => setResendMsg(""), 3000);
    } catch {
      setResendMsg("Failed to send. Try again shortly.");
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        router.replace("/orchids/dashboard");
        return;
      }
    }
    setChecking(false);
    setResendMsg("Not verified yet — check your inbox and click the link.");
    setTimeout(() => setResendMsg(""), 4000);
  };

  if (loading || !user) return null;

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

      <div style={{
        width: "100%",
        maxWidth: 460,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "44px 40px",
        textAlign: "center",
      }}>
        {/* Envelope icon */}
        <div style={{
          width: 64,
          height: 64,
          background: "var(--blue)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 28px",
          fontSize: 28,
        }}>
          ✉
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 26,
          color: "white",
          margin: "0 0 12px",
          letterSpacing: "-0.02em",
        }}>
          Check your email
        </h1>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 8px" }}>
          We sent a verification link to
        </p>
        <p style={{ fontSize: 15, color: "white", fontWeight: 600, margin: "0 0 32px" }}>
          {user.email}
        </p>

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 32px" }}>
          Click the link in the email to activate your account.
          This page will automatically redirect once you&apos;re verified.
        </p>

        {/* Check now button */}
        <button
          onClick={handleCheckNow}
          disabled={checking}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "var(--blue)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: checking ? "not-allowed" : "pointer",
            opacity: checking ? 0.6 : 1,
            marginBottom: 12,
          }}
        >
          {checking ? "Checking…" : "I've verified my email"}
        </button>

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "transparent",
            color: resendCooldown > 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.65)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            fontSize: 14,
            cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
          }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification email"}
        </button>

        {/* Status message */}
        {resendMsg && (
          <p style={{
            marginTop: 16,
            fontSize: 13,
            color: resendMsg.includes("sent") ? "#52be80" : "#f1948a",
          }}>
            {resendMsg}
          </p>
        )}
      </div>

      {/* Sign out / wrong account */}
      <button
        onClick={async () => { await signOut(); router.push("/orchids/auth"); }}
        style={{
          marginTop: 24,
          background: "none",
          border: "none",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
          cursor: "pointer",
        }}
      >
        Wrong account? Sign out
      </button>
    </div>
  );
}
