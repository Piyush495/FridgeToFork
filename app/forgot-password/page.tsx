"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthBackground from "@/components/AuthBackground";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send reset code");
        setLoading(false);
        return;
      }

      toast.success("Reset code sent to your email!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-[#F4F9F4] via-white to-[#EAF5EB] p-4 font-sans">
      <AuthBackground />
      <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#2D6A4F]/10 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#EAF5EB] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#2D6A4F] border border-[#52B788]/20 text-3xl">
            🔑
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] tracking-tight mb-2">
            Forgot Password?
          </h2>
          <p className="text-[#7A7A6E] text-sm font-normal px-2">
            Enter your registered email address and we&apos;ll send you a 6-digit code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B1B1B] block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FFFFFF] border border-gray-200 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl pl-12 pr-4 py-3 text-sm transition placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-lg shadow-[#2D6A4F]/15 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Sending Code..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-[#2D6A4F] font-semibold hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
