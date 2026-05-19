"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#2D6A4F]/10 border border-black/5 w-full max-w-md">
      <Link href="/" className="font-serif text-xl font-black text-[#2D6A4F] tracking-tight inline-block mb-6">
        Fridge<span className="text-[#774936]">To</span>Fork
      </Link>

      <h1 className="font-serif text-3xl font-black text-[#1B1B1B] tracking-tight mb-1">Welcome back</h1>
      <p className="text-[#7A7A6E] text-sm mb-6 font-light">
        Log in to your FridgeToFork account
      </p>

      {registered && (
        <div className="bg-[#D8F3DC] text-[#2D6A4F] text-sm px-4 py-3 rounded-lg mb-4 border border-[#52B788]/30">
          Account created! Please log in.
        </div>
      )}

      {error && (
        <div className="bg-[#f5ede8] text-[#774936] text-sm px-4 py-3 rounded-lg mb-4 border border-[#774936]/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#7A7A6E] uppercase tracking-widest block mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-4 py-2.5 text-sm placeholder:text-[#7A7A6E]/60 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#7A7A6E] uppercase tracking-widest block mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-4 py-2.5 text-sm placeholder:text-[#7A7A6E]/60 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] text-white font-medium py-3 rounded-full text-sm transition shadow-lg shadow-[#2D6A4F]/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-[#7A7A6E] mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="text-[#2D6A4F] font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FEFAE0] px-4 sm:px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🥦", "🍳", "🧅", "🍅", "🥕", "🌿"].map((e, i) => (
          <span
            key={i}
            className="absolute text-2xl sm:text-4xl opacity-10 sm:opacity-15"
            style={{
              top: `${[15, 25, 70, 80, 55, 10][i]}%`,
              left: i % 2 === 0 ? `${[5, 3, 12][Math.floor(i / 2)]}%` : undefined,
              right: i % 2 !== 0 ? `${[8, 5, 20][Math.floor(i / 2)]}%` : undefined,
            }}
          >
            {e}
          </span>
        ))}
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
