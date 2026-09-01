"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthBackground from "@/components/AuthBackground";
import toast from "react-hot-toast";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  // Resend cooldown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      toast.success("Email verified successfully!");

      // Attempt auto sign-in if password was stored during registration
      let pendingPassword: string | null = null;
      try {
        pendingPassword = sessionStorage.getItem("signup_password");
        if (pendingPassword) {
          sessionStorage.removeItem("signup_password");
        }
      } catch (e) {
        // Ignore if sessionStorage is disabled
      }

      if (pendingPassword) {
        const signInRes = await signIn("credentials", {
          email,
          password: pendingPassword,
          redirect: false,
        });

        if (!signInRes?.error) {
          window.location.href = "/dashboard";
          return;
        }
      }

      // Fallback if password isn't found in sessionStorage
      router.push("/login?verified=true");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to resend code");
        setResending(false);
        return;
      }

      toast.success("A new verification code has been sent!");
      setTimer(60);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#2D6A4F]/10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#EAF5EB] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#2D6A4F] border border-[#52B788]/20 text-3xl">
          ✉️
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] tracking-tight mb-2">
          Verify your email
        </h2>
        <p className="text-[#7A7A6E] text-sm font-normal px-2">
          We sent a 6-digit verification code to <span className="font-semibold text-[#1B1B1B] break-all">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1B1B1B] block text-center uppercase tracking-widest">
            Enter OTP Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
            className="w-full tracking-[8px] text-center font-bold text-2xl bg-[#F4F9F4] border border-[#2D6A4F]/15 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl py-3 focus:outline-none placeholder:text-gray-300 placeholder:tracking-[2px]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-lg shadow-[#2D6A4F]/15 flex items-center justify-center"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-[#7A7A6E]">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className="text-[#2D6A4F] font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {timer > 0 ? `Resend in ${timer}s` : resending ? "Resending..." : "Resend Code"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-[#F4F9F4] via-white to-[#EAF5EB] p-4 font-sans">
      <AuthBackground />
      <Suspense fallback={<div className="text-[#2D6A4F] font-medium">Loading screen...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
