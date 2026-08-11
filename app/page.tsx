import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F4F9F4] via-white to-[#EAF5EB] flex flex-col relative overflow-x-hidden font-sans">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-[#2D6A4F]/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 text-[#2D6A4F]">
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
          <span className="font-serif text-xl font-black text-[#2D6A4F] tracking-tight">
            FridgeToFork
          </span>
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="#how" className="hidden sm:block text-sm text-[#7A7A6E] hover:text-[#2D6A4F] font-medium transition">
            How it works
          </a>
          <a href="#features" className="hidden sm:block text-sm text-[#7A7A6E] hover:text-[#2D6A4F] font-medium transition">
            Features
          </a>
          <Link
            href="/register"
            className="bg-[#2D6A4F] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#1e5038] transition shadow-md shadow-[#2D6A4F]/20 whitespace-nowrap"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* BACKGROUND DECORATIVE GRAPHICS */}
      {/* Top-left dot grid */}
      <div className="hidden lg:block absolute top-24 left-16 opacity-30 pointer-events-none select-none">
        <div className="grid grid-cols-4 gap-3">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
          ))}
        </div>
      </div>

      {/* Bottom-right dot grid */}
      <div className="hidden lg:block absolute top-[520px] right-16 opacity-30 pointer-events-none select-none">
        <div className="grid grid-cols-4 gap-3">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
          ))}
        </div>
      </div>

      {/* Left Cutting Board Graphic */}
      <div className="hidden lg:block absolute left-0 top-[220px] w-[380px] xl:w-[440px] pointer-events-none select-none z-0 mix-blend-multiply opacity-90 transform -translate-x-[25%] hover:-translate-x-[20%] transition-all duration-300">
        <img src="/auth-food.png" alt="Ingredients decor" className="w-full h-auto object-contain" />
      </div>

      {/* Right Salad Plate Graphic */}
      <div className="hidden lg:block absolute right-0 top-[160px] w-[420px] h-[420px] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.98] transition-all duration-300 transform translate-x-[45%] hover:translate-x-[40%]">
        <div className="w-full h-full bg-[url('/dashboard-food.png')] bg-[length:300%_auto] bg-[position:100%_center] bg-no-repeat"/>
      </div>

      {/* HERO SECTION */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 text-center max-w-4xl mx-auto flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#EAF5EB] text-[#2D6A4F] px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[#52B788]/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          AI-Powered Meal Planning
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-[#1B1B1B] leading-[1.1] tracking-tight mb-4">
          What&apos;s in your fridge?<br />
          Let <span className="text-[#2D6A4F]">AI</span> decide dinner.
        </h1>

        <p className="text-[#7A7A6E] text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed mb-8">
          Stop staring at your fridge wondering what to cook. Add your ingredients and get personalised recipes in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-center justify-center w-full max-w-xs sm:max-w-none">
          <Link
            href="/register"
            className="w-full sm:w-auto text-center bg-[#2D6A4F] hover:bg-[#1e5038] text-white px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold shadow-xl shadow-[#2D6A4F]/25 transition hover:-translate-y-0.5"
          >
            Start cooking for free →
          </Link>
          <a
            href="#how"
            className="w-full sm:w-auto text-center bg-white hover:bg-[#F4F9F4] text-[#1B1B1B] border border-[#2D6A4F]/20 px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold transition hover:border-[#2D6A4F]"
          >
            See how it works
          </a>
        </div>

        {/* DEMO CARD */}
        <div className="mt-12 sm:mt-16 bg-white rounded-3xl border border-black/5 shadow-xl p-6 sm:p-8 max-w-3xl w-full text-left relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Ingredients Column */}
            <div className="sm:col-span-7">
              <span className="text-xs font-bold text-[#2D6A4F] tracking-widest uppercase mb-4 block">
                YOUR INGREDIENTS
              </span>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { name: "eggs", icon: "🥚" },
                  { name: "tomato", icon: "🍅" },
                  { name: "onion", icon: "🧅" },
                  { name: "paneer", icon: "🧀" },
                  { name: "coriander", icon: "🌿" },
                ].map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#F4F9F4] text-[#2D6A4F] border border-[#52B788]/20"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#EAF5EB] text-[#2D6A4F] px-3 py-1 rounded-full text-xs font-semibold border border-[#52B788]/30">
                <span>✦</span>
                <span>AI Generated</span>
              </div>
            </div>

            {/* Generated Recipe Preview Column */}
            <div className="sm:col-span-5 bg-[#FEFAE0]/80 rounded-2xl p-5 border border-dashed border-[#2D6A4F]/25 flex flex-col justify-between">
              <div>
                <p className="font-serif text-lg font-bold text-[#1B1B1B] mb-3 leading-snug">
                  Paneer Bhurji with Masala Eggs
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#7A7A6E] font-medium pt-2 border-t border-[#2D6A4F]/10">
                <span className="flex items-center gap-1">⏱ 20 mins</span>
                <span className="flex items-center gap-1">👥 2 servings</span>
                <span className="flex items-center gap-1">🍽 Indian</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-16 sm:py-24 px-4 max-w-5xl mx-auto text-center relative z-10">
        <span className="text-xs font-bold text-[#2D6A4F] tracking-widest uppercase mb-3 block">
          HOW IT WORKS
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#1B1B1B] tracking-tight mb-12 sm:mb-16">
          From fridge to fork in three steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              num: "01",
              title: "Add your ingredients",
              desc: "Type in whatever you have in your fridge or pantry. No need for exact quantities.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20z" />
                  <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
                </svg>
              ),
            },
            {
              num: "02",
              title: "AI generates recipes",
              desc: "Get 3 personalised recipes instantly, tailored to your diet and cook time preferences.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
            },
            {
              num: "03",
              title: "Plan your week",
              desc: "Save favourites and build a weekly meal plan — everything in one place.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
            },
          ].map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F2F7F4] flex items-center justify-center text-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors duration-300">
                  {s.icon}
                </div>
                <span className="text-xs font-bold text-[#2D6A4F] tracking-widest uppercase">
                  STEP {s.num}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B1B1B] mb-2.5">
                {s.title}
              </h3>
              <p className="text-sm text-[#7A7A6E] leading-relaxed font-light">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-16 sm:py-20 px-4 max-w-5xl mx-auto text-center relative z-10">
        <span className="text-xs font-bold text-[#2D6A4F] tracking-widest uppercase mb-3 block">
          FEATURES
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#1B1B1B] tracking-tight mb-12 sm:mb-16">
          Everything you need to eat well
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {[
            {
              icon: "🤖",
              title: "AI Recipe Generation",
              desc: "Powered by OpenAI — generates recipes with steps, timing, and nutrition info.",
            },
            {
              icon: "🔖",
              title: "Save Favourites",
              desc: "Save recipes you love and filter by cuisine type anytime.",
            },
            {
              icon: "📅",
              title: "Weekly Meal Planner",
              desc: "Assign recipes to each day and track your weekly plan at a glance.",
            },
            {
              icon: "🥗",
              title: "Diet Preferences",
              desc: "Vegetarian, vegan, or no restrictions — recipes always match your needs.",
            },
            {
              icon: "⏱",
              title: "Cook Time Filter",
              desc: "Filter by cook time to find recipes that fit your schedule.",
            },
            {
              icon: "🔒",
              title: "Secure & Personal",
              desc: "Your data is private and secured with NextAuth authentication.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F2F7F4] flex items-center justify-center text-[#2D6A4F] mb-4 text-2xl">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1B1B1B] mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-[#7A7A6E] leading-relaxed font-light">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="max-w-4xl mx-auto w-full px-4 my-16 sm:my-20 relative z-10">
        <div className="bg-[#2D6A4F] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl text-white">
          <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Ready to stop wasting food?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 font-light max-w-md mx-auto">
            Turn your leftover ingredients into delicious meals today.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#2D6A4F] hover:bg-[#F4F9F4] px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition shadow-lg hover:-translate-y-0.5"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2D6A4F]/10 bg-white/50 py-6 px-4 text-center text-xs text-[#7A7A6E] relative z-10">
        © {new Date().getFullYear()} FridgeToFork. All rights reserved. Made with 🍴 by Piyush Gupta.
      </footer>

    </main>
  );
}