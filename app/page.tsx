import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FEFAE0] font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-[5%] py-4 bg-[#FEFAE0]/85 backdrop-blur-md border-b border-[#2D6A4F]/10">
        <span className="font-serif text-xl sm:text-2xl font-black text-[#2D6A4F] tracking-tight">
          Fridge<span className="text-[#774936]">To</span>Fork
        </span>
        <div className="flex items-center gap-3 sm:gap-8">
          <a href="#how" className="hidden sm:block text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition">How it works</a>
          <a href="#features" className="hidden sm:block text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition">Features</a>
          <Link href="/register" className="bg-[#2D6A4F] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium hover:bg-[#1e5038] transition shadow-lg shadow-[#2D6A4F]/20 whitespace-nowrap">
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-[5%] pt-28 sm:pt-32 pb-16 sm:pb-20 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🥦", "🍳", "🧅", "🍅", "🥕", "🌿"].map((e, i) => (
            <span key={i} className="absolute text-3xl sm:text-4xl opacity-10 sm:opacity-15 animate-bounce" style={{
              top: `${[15, 25, 70, 80, 55, 10][i]}%`,
              left: i % 2 === 0 ? `${[5, 3, 12][Math.floor(i / 2)]}%` : undefined,
              right: i % 2 !== 0 ? `${[8, 5, 20][Math.floor(i / 2)]}%` : undefined,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s"
            }}>{e}</span>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#2D6A4F] px-4 py-1.5 rounded-full text-xs font-medium mb-5 border border-[#52B788]/30">
          ✦ AI-Powered Meal Planning
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl font-black leading-[1.08] sm:leading-[1.05] tracking-tight text-[#1B1B1B] max-w-4xl mb-5 sm:mb-6">
          What's in your fridge?<br />Let <em className="text-[#2D6A4F] not-italic">AI</em> decide dinner.
        </h1>

        <p className="text-base sm:text-lg text-[#7A7A6E] max-w-sm sm:max-w-lg leading-relaxed font-light mb-8 sm:mb-10">
          Stop staring at your fridge wondering what to cook. Add your ingredients and get personalised recipes in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full max-w-sm sm:max-w-none">
          <Link href="/register" className="w-full sm:w-auto text-center bg-[#2D6A4F] text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-[#1e5038] transition shadow-xl shadow-[#2D6A4F]/30 hover:-translate-y-0.5">
            Start cooking for free →
          </Link>
          <a href="#how" className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full text-base border border-black/10 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition">
            See how it works
          </a>
        </div>

        {/* Demo card */}
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl p-5 sm:p-6 shadow-2xl w-full max-w-sm sm:max-w-md border border-black/5 text-left">
          <p className="text-xs text-[#7A7A6E] font-medium uppercase tracking-widest mb-3">Your ingredients</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["🥚 eggs", "🍅 tomato", "🧅 onion", "🧀 paneer", "🌿 coriander"].map((item, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${i % 2 === 0 ? "bg-[#D8F3DC] text-[#2D6A4F] border-[#52B788]/30" : "bg-[#f5ede8] text-[#774936] border-[#774936]/20"}`}>
                {item}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
            ✦ AI Generated
          </span>
          <div className="bg-[#FEFAE0] rounded-xl p-4 border border-dashed border-[#2D6A4F]/20">
            <p className="font-serif text-base sm:text-lg font-bold text-[#1B1B1B] mb-1">Paneer Bhurji with Masala Eggs</p>
            <div className="flex gap-4 text-xs text-[#7A7A6E]">
              <span>⏱ 20 mins</span>
              <span>👥 2 servings</span>
              <span>🍽 Indian</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 sm:px-[5%] py-20 sm:py-24">
        <p className="text-xs font-medium tracking-widest uppercase text-[#2D6A4F] text-center mb-4">How it works</p>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-center text-[#1B1B1B] tracking-tight mb-12 sm:mb-16">From fridge to fork<br />in three steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {[
            { icon: "🥦", num: "01", title: "Add your ingredients", desc: "Type in whatever you have in your fridge or pantry. No need for exact quantities." },
            { icon: "✨", num: "02", title: "AI generates recipes", desc: "Get 3 personalised recipes instantly, tailored to your diet and cook time preferences." },
            { icon: "📅", num: "03", title: "Plan your week", desc: "Save favourites and build a weekly meal plan — everything in one place." },
          ].map((s) => (
            <div key={s.num} className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 text-center hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">{s.icon}</div>
              <p className="text-xs font-medium text-[#2D6A4F] uppercase tracking-widest mb-2">Step {s.num}</p>
              <p className="font-serif text-xl font-bold text-[#1B1B1B] mb-3">{s.title}</p>
              <p className="text-sm text-[#7A7A6E] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 sm:px-[5%] pb-20 sm:pb-24">
        <p className="text-xs font-medium tracking-widest uppercase text-[#2D6A4F] text-center mb-4">Features</p>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-center text-[#1B1B1B] tracking-tight mb-12 sm:mb-16">Everything you need<br />to eat well</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {[
            { icon: "🤖", title: "AI Recipe Generation", desc: "Powered by OpenAI — generates recipes with steps, timing, and nutrition info." },
            { icon: "🔖", title: "Save Favourites", desc: "Save recipes you love and filter by cuisine type anytime." },
            { icon: "📅", title: "Weekly Meal Planner", desc: "Assign recipes to each day and track your weekly plan at a glance." },
            { icon: "🥗", title: "Diet Preferences", desc: "Vegetarian, vegan, or no restrictions — recipes always match your needs." },
            { icon: "⏱", title: "Cook Time Filter", desc: "Filter by cook time to find recipes that fit your schedule." },
            { icon: "🔒", title: "Secure & Personal", desc: "Your data is private and secured with JWT authentication." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="font-medium text-[#1B1B1B] mb-1">{f.title}</p>
              <p className="text-sm text-[#7A7A6E] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mx-4 sm:mx-[5%] mb-16 sm:mb-20 bg-[#2D6A4F] rounded-3xl px-6 sm:px-[5%] py-14 sm:py-20 text-center relative overflow-hidden">
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Ready to stop wasting food?</h2>
        <p className="text-white/70 text-base sm:text-lg mb-8 font-light">Turn your leftover ingredients into delicious meals today.</p>
        <Link href="/register" className="inline-block bg-white text-[#2D6A4F] px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-medium hover:-translate-y-0.5 hover:shadow-xl transition-all text-sm sm:text-base">
          Get started — it's free
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="text-center pb-8 text-xs text-[#7A7A6E] border-t border-black/5 pt-6 px-4">
        Made with 🍴 by <span className="text-[#2D6A4F] font-medium">Piyush Gupta</span> · Built with Next.js, MongoDB &amp; OpenAI
      </footer>

    </main>
  );
}