"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { SkeletonCard } from "@/components/Skeleton";
import toast from "react-hot-toast";

interface Recipe {
    _id: string;
    name: string;
    cookTime: number;
    servings: number;
    cuisineType: string;
    macros: { protein: number; carbs: number; fat: number };
    ingredients: { item: string; amount: string; unit: string }[];
    steps: string[];
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [input, setInput] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [prefs, setPrefs] = useState({
        diet: "none",
        cuisine: "any",
        cookTime: "30",
        servings: "2",
    });
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [generationsLeft, setGenerationsLeft] = useState<number | null>(null);

    useEffect(() => {
        const fetchGenerationsLeft = async () => {
            const res = await fetch("/api/user");
            const data = await res.json();
            setGenerationsLeft(data.generationsLeft);
        };
        fetchGenerationsLeft();
    }, []);

    const addIngredient = () => {
        const trimmed = input.trim().toLowerCase();
        if (!trimmed) return;
        if(ingredients.includes(trimmed)){
            toast.error("Ingredient already added");
            return;
        }
        setIngredients([...ingredients, trimmed]);
        setInput("");
    };

    const removeIngredient = (item: string) => {
        setIngredients(ingredients.filter((i) => i !== item));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addIngredient();
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        setRecipes([]);

        const res = await fetch("/api/generate-recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients, prefs }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
            setLoading(false);
            return;
        }

        setRecipes(data.recipes);
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#F4F9F4] via-white to-[#EAF5EB] flex flex-col">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-[#2D6A4F]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
                <Link href="/dashboard" className="flex items-center gap-2.5">
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
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-sm text-[#7A7A6E] hidden md:inline font-medium">
                        Hey, {session?.user?.name?.split(" ")[0]} 👋
                    </span>
                    <Link
                        href="/my-recipes"
                        className="text-xs sm:text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg hover:bg-[#F4F9F4]"
                        title="My Recipes"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                        <span className="hidden sm:inline">My Recipes</span>
                    </Link>
                    <Link
                        href="/meal-plan"
                        className="text-xs sm:text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg hover:bg-[#F4F9F4]"
                        title="Meal Plan"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="hidden sm:inline">Meal Plan</span>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-xs sm:text-sm text-[#2D6A4F] font-semibold border border-[#2D6A4F] px-3 sm:px-4 py-1.5 rounded-xl hover:bg-[#2D6A4F] hover:text-white transition flex items-center gap-1"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span className="hidden xs:inline sm:inline">Sign out</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-x-hidden">
                {/* Decorative dots - top left */}
                <div className="hidden lg:block absolute top-8 left-16 opacity-30 pointer-events-none select-none">
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
                        ))}
                    </div>
                </div>

                {/* Decorative dots - top right */}
                <div className="hidden lg:block absolute top-12 right-20 opacity-30 pointer-events-none select-none">
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/25"/>
                        ))}
                    </div>
                </div>

                {/* Decorative Food Assets from User Mockup */}
                {/* Left Spinach Bowl */}
                <div className="hidden lg:block absolute left-0 top-[10%] xl:top-[12%] w-[420px] h-[420px] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.98] transition-all duration-300 transform -translate-x-[50%] hover:-translate-x-[45%]">
                    <div className="w-full h-full bg-[url('/dashboard-food.png')] bg-[length:300%_auto] bg-[position:49.5%_center] bg-no-repeat"/>
                </div>

                {/* Right Salad Plate */}
                <div className="hidden lg:block absolute right-0 top-[10%] xl:top-[12%] w-[420px] h-[420px] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.98] transition-all duration-300 transform translate-x-[50%] hover:translate-x-[45%]">
                    <div className="w-full h-full bg-[url('/dashboard-food.png')] bg-[length:300%_auto] bg-[position:100%_center] bg-no-repeat"/>
                </div>

                {/* Hero Section */}
                <div className="text-center pt-10 sm:pt-14 pb-6 px-4">
                    <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#2D6A4F] px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-[#52B788]/30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        AI-Powered Meal Planning
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-[#1B1B1B] tracking-tight mb-3">
                        What&apos;s in your fridge?
                    </h2>
                    <p className="text-[#7A7A6E] text-base sm:text-lg max-w-lg mx-auto font-light leading-relaxed">
                        Add your ingredients and we&apos;ll generate delicious recipes
                        you can make right now.
                    </p>
                </div>

                {/* Three-column layout: Tip | Main | Why */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex gap-6 items-start">

                    {/* Left - Tip of the Day (Desktop only) */}
                    <div className="hidden xl:block w-56 flex-shrink-0 mt-8">
                        <div className="bg-[#F2F7F4] rounded-2xl p-5 shadow-none border-none">
                            <div className="w-11 h-11 rounded-full bg-white shadow-sm text-[#2D6A4F] flex items-center justify-center mb-3">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                    <path d="M9 18h6"/>
                                    <path d="M10 22h4"/>
                                    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
                                </svg>
                            </div>
                            <h4 className="font-bold text-sm text-[#1B1B1B] mb-1">Tip of the day</h4>
                            <p className="text-xs text-[#7A7A6E] leading-relaxed mb-3">
                                Add more ingredients to get better recipe suggestions!
                            </p>
                            <div className="flex justify-end">
                                <span className="text-[#2D6A4F] hover:translate-x-1 transition-transform cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center - Main Content */}
                    <div className="flex-1 max-w-2xl mx-auto w-full">
                        {/* Ingredient Input */}
                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 sm:p-6 mb-5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#1B1B1B] uppercase tracking-widest mb-4">
                                <span className="text-base">🥗</span>
                                Add ingredients
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="e.g. tomato, eggs, cheese..."
                                    className="flex-1 min-w-0 bg-white border border-[#2D6A4F]/12 rounded-xl px-4 py-3 text-sm placeholder:text-[#7A7A6E]/60 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
                                />
                                <button
                                    onClick={addIngredient}
                                    className="bg-[#2D6A4F] hover:bg-[#1e5038] text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-md shadow-[#2D6A4F]/20 flex-shrink-0"
                                >
                                    Add
                                </button>
                            </div>

                            {ingredients.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {ingredients.map((item) => (
                                        <span
                                            key={item}
                                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#D8F3DC] text-[#2D6A4F] border border-[#52B788]/30 capitalize"
                                        >
                                            {item}
                                            <button
                                                onClick={() => removeIngredient(item)}
                                                className="opacity-60 hover:opacity-100 transition text-xs font-bold ml-0.5"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 sm:p-6 mb-6">
                            <h3 className="flex items-center gap-2 text-xs font-semibold text-[#1B1B1B] uppercase tracking-widest mb-4">
                                <span className="text-base">⚙️</span>
                                Your preferences
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#7A7A6E] block mb-1.5 font-medium">Diet</label>
                                    <div className="relative">
                                        <select
                                            value={prefs.diet}
                                            onChange={(e) => setPrefs({ ...prefs, diet: e.target.value })}
                                            className="w-full bg-white border border-[#2D6A4F]/12 rounded-xl pl-3 pr-10 py-2.5 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition appearance-none cursor-pointer"
                                        >
                                            <option value="none">No restriction</option>
                                            <option value="vegetarian">Vegetarian</option>
                                            <option value="vegan">Vegan</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#7A7A6E]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-[#7A7A6E] block mb-1.5 font-medium">Cuisine</label>
                                    <div className="relative">
                                        <select
                                            value={prefs.cuisine}
                                            onChange={(e) => setPrefs({ ...prefs, cuisine: e.target.value })}
                                            className="w-full bg-white border border-[#2D6A4F]/12 rounded-xl pl-3 pr-10 py-2.5 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition appearance-none cursor-pointer"
                                        >
                                            <option value="any">Any</option>
                                            <option value="indian">Indian</option>
                                            <option value="italian">Italian</option>
                                            <option value="chinese">Chinese</option>
                                            <option value="mexican">Mexican</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#7A7A6E]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-[#7A7A6E] block mb-1.5 font-medium">Max cook time</label>
                                    <div className="relative">
                                        <select
                                            value={prefs.cookTime}
                                            onChange={(e) => setPrefs({ ...prefs, cookTime: e.target.value })}
                                            className="w-full bg-white border border-[#2D6A4F]/12 rounded-xl pl-3 pr-10 py-2.5 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition appearance-none cursor-pointer"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">1 hour</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#7A7A6E]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-[#7A7A6E] block mb-1.5 font-medium">Servings</label>
                                    <div className="relative">
                                        <select
                                            value={prefs.servings}
                                            onChange={(e) => setPrefs({ ...prefs, servings: e.target.value })}
                                            className="w-full bg-white border border-[#2D6A4F]/12 rounded-xl pl-3 pr-10 py-2.5 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition appearance-none cursor-pointer"
                                        >
                                            <option value="1">1 person</option>
                                            <option value="2">2 people</option>
                                            <option value="4">4 people</option>
                                            <option value="6">6 people</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#7A7A6E]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Generations remaining */}
                        {generationsLeft !== null && (
                            <p className="text-xs text-[#7A7A6E] text-center mb-3 flex items-center justify-center gap-1.5">
                                {generationsLeft} generation{generationsLeft !== 1 ? "s" : ""} remaining today
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 opacity-50">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                            </p>
                        )}

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={ingredients.length === 0 || loading}
                            className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-xl shadow-[#2D6A4F]/25 hover:-translate-y-0.5 mb-8 flex items-center justify-center gap-2"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            {loading
                                ? "Generating recipes..."
                                : ingredients.length === 0
                                    ? "Add at least one ingredient to generate"
                                    : `Generate recipes with ${ingredients.length} ingredient${ingredients.length > 1 ? "s" : ""}`}
                        </button>

                        {/* Error */}
                        {error && (
                            <div className="bg-[#f5ede8] text-[#774936] text-sm px-4 py-3 rounded-xl mb-6 border border-[#774936]/20 flex items-center gap-2">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Recipe Cards - Loading */}
                        {loading && (
                            <div>
                                <h3 className="font-serif text-xl font-bold text-[#1B1B1B] mb-4">
                                    Generating your recipes...
                                </h3>
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recipe Cards - Results */}
                        {!loading && recipes.length > 0 && (
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                                    ✦ AI Generated
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[#1B1B1B] mb-4">
                                    Here&apos;s what you can make 🍳
                                </h3>
                                <div className="space-y-4">
                                    {recipes.map((recipe) => (
                                        <div
                                            key={recipe._id}
                                            className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-serif text-lg font-bold text-[#1B1B1B] group-hover:text-[#2D6A4F] transition">
                                                    {recipe.name}
                                                </h4>
                                                <span className="text-xs bg-[#D8F3DC] text-[#2D6A4F] px-2.5 py-1 rounded-full border border-[#52B788]/30 flex-shrink-0 ml-2 font-medium">
                                                    {recipe.cuisineType}
                                                </span>
                                            </div>
                                            <div className="flex gap-4 text-xs text-[#7A7A6E] mb-4">
                                                <span>⏱ {recipe.cookTime} mins</span>
                                                <span>👥 {recipe.servings} servings</span>
                                                <span>💪 {recipe.macros?.protein}g protein</span>
                                            </div>
                                            <Link
                                                href={`/recipe/${recipe._id}`}
                                                className="text-sm text-[#2D6A4F] font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                View full recipe
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                                    <polyline points="12 5 19 12 12 19"/>
                                                </svg>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Dummy column to maintain layout centering (Desktop only) */}
                    <div className="hidden xl:block w-56 flex-shrink-0 mt-8"/>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-[#2D6A4F]/8 bg-white/50 px-4 sm:px-8 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-center">
                    <div className="flex items-center gap-2 select-none">
                        <div className="w-5 h-5 text-[#2D6A4F]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full fill-[#2D6A4F]">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20z" />
                                <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
                            </svg>
                        </div>
                        <span className="text-xs text-[#7A7A6E]">© {new Date().getFullYear()} FridgeToFork. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
