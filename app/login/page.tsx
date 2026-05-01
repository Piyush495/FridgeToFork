"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
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
    toast.success("Logged in successfully");

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-green-200 p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">
          Log in to your FridgeToFork account
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Johndoe@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}











// "use client";

// import React from "react";

// const AuthPage: React.FC = () => {
//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 font-sans">
//       {/* Abstract Background Shapes */}
//       <div className="absolute -bottom-20 -left-20 z-0 h-[350px] w-[350px] rounded-full bg-[#ffc841]"></div>
//       <div className="absolute -right-[100px] -top-[150px] z-0 h-[500px] w-[500px] rotate-45 bg-[#ea546c]"></div>

//       {/* Main Authentication Card */}
//       <div className="relative z-10 flex min-h-[550px] w-[900px] max-w-[95%] flex-col overflow-hidden rounded-xl bg-white shadow-[0_14px_28px_rgba(0,0,0,0.05),_0_10px_10px_rgba(0,0,0,0.05)] md:flex-row">

//         {/* Left Panel: Sign In */}
//         <div className="relative flex flex-1 flex-col items-center justify-center bg-[#3bb19b] p-10 text-center text-white">
//           <div className="absolute left-8 top-8 flex items-center text-lg font-medium">
//             <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//               <line x1="9" y1="3" x2="9" y2="21"></line>
//               <path d="M13 8l-2 2 2 2"></path>
//               <path d="M13 16l-2-2 2-2"></path>
//             </svg>
//             <span>Diprella</span>
//           </div>

//           <h2 className="mb-5 text-4xl font-bold">Welcome Back!</h2>
//           <p className="mb-9 text-[0.95rem] font-normal leading-relaxed">
//             To keep connected with us please<br />login with your personal info
//           </p>
//           <button className="rounded-full border border-white bg-transparent px-12 py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform active:scale-95">
//             SIGN IN
//           </button>
//         </div>

//         {/* Right Panel: Sign Up */}
//         <div className="flex flex-[1.5] flex-col items-center justify-center bg-white p-12">
//           <h2 className="mb-4 text-4xl font-bold text-[#3bb19b]">Create Account</h2>

//           <div className="mb-5 flex space-x-5">
//             <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-[#3bb19b] hover:text-[#3bb19b]">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
//             </a>
//             <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-[#3bb19b] hover:text-[#3bb19b]">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path></svg>
//             </a>
//             <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-[#3bb19b] hover:text-[#3bb19b]">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
//             </a>
//           </div>

//           <span className="mb-5 text-[0.85rem] text-slate-400">or use your email for registration:</span>

//           <form className="flex w-full max-w-[350px] flex-col items-center" onSubmit={(e) => e.preventDefault()}>
//             <div className="mb-4 flex w-full items-center rounded bg-[#f3f7f6] px-5 py-3.5">
//               <svg className="mr-4 shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
//               <input className="w-full bg-transparent text-[0.95rem] text-slate-800 outline-none placeholder:text-slate-400" type="text" placeholder="Name" required />
//             </div>

//             <div className="mb-4 flex w-full items-center rounded bg-[#f3f7f6] px-5 py-3.5">
//               <svg className="mr-4 shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
//               <input className="w-full bg-transparent text-[0.95rem] text-slate-800 outline-none placeholder:text-slate-400" type="email" placeholder="Email" required />
//             </div>

//             <div className="mb-4 flex w-full items-center rounded bg-[#f3f7f6] px-5 py-3.5">
//               <svg className="mr-4 shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
//               <input className="w-full bg-transparent text-[0.95rem] text-slate-800 outline-none placeholder:text-slate-400" type="password" placeholder="Password" required />
//             </div>

//             <button className="mt-4 rounded-full bg-[#3bb19b] px-14 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-transform active:scale-95">
//               SIGN UP
//             </button>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AuthPage;
