"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthBackground from "@/components/AuthBackground";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  };

  const handleGoogleSignIn = () => {
    toast("Google sign-in is coming soon! Please use your email and password.", {
      icon: "🍳",
      style: {
        background: "#2D6A4F",
        color: "#FEFAE0",
      },
    });
  };

  return (
    <main className="min-h-screen lg:h-screen w-full lg:grid lg:grid-cols-2 relative overflow-hidden bg-gradient-to-tr from-[#F4F9F4] via-white to-[#EAF5EB]">
      {/* Brand Column (Desktop only) */}
      <div className="hidden lg:flex flex-col justify-center pl-12 xl:pl-20 pr-16 xl:pr-20 py-8 relative bg-[#EFF7EF] border-r border-[#2D6A4F]/15 overflow-hidden h-full">
        {/* Right-shifted container within the left column */}
        <div className="flex flex-col max-w-[420px] w-full ml-auto">
          {/* Content wrapper */}
          <div className="flex flex-col gap-10 select-none">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 text-[#2D6A4F]">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="12" width="18" height="38" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <line x1="10" y1="27" x2="28" y2="27" stroke="currentColor" strokeWidth="3"/>
                  <rect x="23" y="18" width="2" height="5" rx="0.5" fill="currentColor"/>
                  <rect x="23" y="32" width="2" height="7" rx="0.5" fill="currentColor"/>
                  <path d="M30 38C30 44.6274 35.3726 50 42 50C48.6274 50 54 44.6274 54 38H30Z" fill="currentColor"/>
                  <path d="M42 38C42 32.5 39 30 39 30C39 30 42.5 31.5 43.5 35C45 31.5 48.5 30 48.5 30C48.5 30 45.5 32.5 45.5 38" fill="#52B788"/>
                  <path d="M35 34L32 23M32 23L30 24.5M32 23L33.5 21.5M32 23L31 21.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M49 34L52 23C52.5 21.5 54.5 23 53.5 24.5L50.5 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-serif text-4xl font-black text-[#2D6A4F] tracking-tight">
                FridgeToFork
              </span>
            </div>

            {/* Welcome Header */}
            <div className="space-y-3">
              <h1 className="font-serif text-5xl font-black text-[#1B1B1B] leading-tight">
                Get started! 🍳
              </h1>
              <p className="text-[#7A7A6E] text-lg font-normal max-w-sm">
                Sign up to start discovering recipes from the ingredients you already have.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-6 max-w-sm">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20z" />
                    <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1B1B1B]">Smart Recipe Suggestions</h3>
                  <p className="text-sm text-[#7A7A6E] mt-0.5">Get personalized recipes based on what's in your fridge.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1B1B1B]">Save Time & Reduce Waste</h3>
                  <p className="text-sm text-[#7A7A6E] mt-0.5">Make the most of your ingredients and time.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1B1B1B]">Eat Better, Every Day</h3>
                  <p className="text-sm text-[#7A7A6E] mt-0.5">Healthy, delicious meals tailored just for you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex flex-col justify-center items-center lg:items-start px-4 sm:px-12 lg:pl-16 xl:pl-20 py-8 relative min-h-screen lg:min-h-0 lg:h-full w-full overflow-y-auto lg:overflow-hidden">
        <div className="lg:hidden absolute inset-0 -z-10">
          <AuthBackground />
        </div>

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex flex-col items-center mb-6 lg:hidden select-none">
          <div className="w-12 h-12 text-[#2D6A4F] flex items-center justify-center">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="12" width="18" height="38" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
              <line x1="10" y1="27" x2="28" y2="27" stroke="currentColor" strokeWidth="3"/>
              <rect x="23" y="18" width="2" height="5" rx="0.5" fill="currentColor"/>
              <rect x="23" y="32" width="2" height="7" rx="0.5" fill="currentColor"/>
              <path d="M30 38C30 44.6274 35.3726 50 42 50C48.6274 50 54 44.6274 54 38H30Z" fill="currentColor"/>
              <path d="M42 38C42 32.5 39 30 39 30C39 30 42.5 31.5 43.5 35C45 31.5 48.5 30 48.5 30C48.5 30 45.5 32.5 45.5 38" fill="#52B788"/>
              <path d="M35 34L32 23M32 23L30 24.5M32 23L33.5 21.5M32 23L31 21.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M49 34L52 23C52.5 21.5 54.5 23 53.5 24.5L50.5 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-serif text-xl font-black text-[#2D6A4F] mt-1 select-none">
            FridgeToFork
          </span>
        </div>

        {/* Main card */}
        <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#2D6A4F]/10 lg:mt-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] tracking-tight mb-2">Create your account 👋</h2>
            <p className="text-[#7A7A6E] text-sm font-normal">
              It only takes a minute to get started.
            </p>
          </div>

          {error && (
            <div className="bg-[#f5ede8] text-[#774936] text-xs sm:text-sm px-4 py-3 rounded-xl mb-6 border border-[#774936]/20 flex items-center gap-2 animate-shake">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1B1B1B] block">
                Full name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-[#FFFFFF] border border-gray-200 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl pl-12 pr-4 py-3 text-sm transition placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1B1B1B] block">
                Email address
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-[#FFFFFF] border border-gray-200 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl pl-12 pr-4 py-3 text-sm transition placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1B1B1B] block">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-[#FFFFFF] border border-gray-200 focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] rounded-xl pl-12 pr-12 py-3 text-sm transition placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] text-white font-medium py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-[#2D6A4F]/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 pt-3"
            >
              <span>{loading ? "Creating account..." : "Create account"}</span>
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold tracking-wider">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#1B1B1B] font-medium py-3 px-4 rounded-xl text-sm transition flex items-center justify-center hover:border-gray-300"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" strokeLinecap="round" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Login redirect */}
          <p className="text-center text-sm text-[#7A7A6E] mt-8 font-normal">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2D6A4F] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


