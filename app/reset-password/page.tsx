"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthBackground from "@/components/AuthBackground";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Password reset failed");
        setLoading(false);
        return;
      }

      toast.success("Password reset successfully! Please sign in.");
      router.push("/login?reset=true");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#2D6A4F]/10 relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] tracking-tight mb-2">
          Reset Password
        </h2>
        <p className="text-[#7A7A6E] text-sm font-normal px-2">
          Enter the 6-digit code sent to <span className="font-semibold text-[#1B1B1B] break-all">{email}</span> and your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OTP Code */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1B1B1B] block uppercase tracking-widest text-center">
            OTP Code
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

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1B1B1B] block">
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-[#FFFFFF] border border-gray-200 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl px-4 py-3 text-sm transition placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1B1B1B] block">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[#FFFFFF] border border-gray-200 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl px-4 py-3 text-sm transition placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Show password toggle */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="accent-[#2D6A4F] cursor-pointer"
          />
          <label htmlFor="showPassword" className="text-xs text-[#7A7A6E] cursor-pointer select-none">
            Show Passwords
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6 || !newPassword}
          className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-lg shadow-[#2D6A4F]/15 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-[#F4F9F4] via-white to-[#EAF5EB] p-4 font-sans">
      <AuthBackground />
      <Suspense fallback={<div className="text-[#2D6A4F] font-medium">Loading screen...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
