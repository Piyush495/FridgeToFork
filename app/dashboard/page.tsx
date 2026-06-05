"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { SkeletonCard } from "@/components/Skeleton";

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
        if (!trimmed || ingredients.includes(trimmed)) return;
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
        <main className="min-h-screen bg-[#FEFAE0]">
            {/* Navbar */}
            <nav className="bg-[#FEFAE0]/85 backdrop-blur-md border-b border-[#2D6A4F]/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <Link href="/dashboard" className="font-serif text-lg sm:text-xl font-black text-[#2D6A4F] tracking-tight">
                    Fridge<span className="text-[#774936]">To</span>Fork
                </Link>
                <div className="flex items-center gap-3 sm:gap-5">
                    <span className="text-sm text-[#7A7A6E] hidden sm:inline">
                        Hey, {session?.user?.name?.split(" ")[0]} 👋
                    </span>
                    <Link
                        href="/my-recipes"
                        className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition hidden sm:inline"
                    >
                        My Recipes
                    </Link>
                    <Link
                        href="/meal-plan"
                        className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition hidden sm:inline"
                    >
                        Meal Plan
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm text-[#7A7A6E] hover:text-[#774936] transition"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-full text-xs font-medium mb-4 border border-[#52B788]/30">
                    ✦ AI-Powered Meal Planning
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#1B1B1B] tracking-tight mb-2">
                    What's in your fridge?
                </h2>
                <p className="text-[#7A7A6E] text-base mb-8 sm:mb-10 font-light">
                    Add your ingredients and we'll generate recipes you can make right now.
                </p>

                {/* Ingredient Input */}
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6 mb-5">
                    <label className="text-xs font-medium text-[#7A7A6E] uppercase tracking-widest block mb-3">
                        Add ingredients
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. tomato, eggs..."
                            className="flex-1 min-w-0 bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-3 sm:px-4 py-2.5 text-sm placeholder:text-[#7A7A6E]/60 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
                        />
                        <button
                            onClick={addIngredient}
                            className="bg-[#2D6A4F] hover:bg-[#1e5038] text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-md shadow-[#2D6A4F]/20 flex-shrink-0"
                        >
                            Add
                        </button>
                    </div>

                    {ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {ingredients.map((item, i) => (
                                <span
                                    key={item}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${i % 2 === 0
                                        ? "bg-[#D8F3DC] text-[#2D6A4F] border-[#52B788]/30"
                                        : "bg-[#f5ede8] text-[#774936] border-[#774936]/20"
                                        }`}
                                >
                                    {item}
                                    <button
                                        onClick={() => removeIngredient(item)}
                                        className="opacity-60 hover:opacity-100 hover:text-[#774936] transition text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6 mb-6">
                    <h3 className="text-xs font-medium text-[#7A7A6E] uppercase tracking-widest mb-4">
                        Your preferences
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="text-xs text-[#7A7A6E] block mb-1.5">Diet</label>
                            <select
                                value={prefs.diet}
                                onChange={(e) => setPrefs({ ...prefs, diet: e.target.value })}
                                className="w-full bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-3 py-2 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
                            >
                                <option value="none">No restriction</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-[#7A7A6E] block mb-1.5">Cuisine</label>
                            <select
                                value={prefs.cuisine}
                                onChange={(e) => setPrefs({ ...prefs, cuisine: e.target.value })}
                                className="w-full bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-3 py-2 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
                            >
                                <option value="any">Any</option>
                                <option value="indian">Indian</option>
                                <option value="italian">Italian</option>
                                <option value="chinese">Chinese</option>
                                <option value="mexican">Mexican</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-[#7A7A6E] block mb-1.5">Max cook time</label>
                            <select
                                value={prefs.cookTime}
                                onChange={(e) => setPrefs({ ...prefs, cookTime: e.target.value })}
                                className="w-full bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-3 py-2 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-[#7A7A6E] block mb-1.5">Servings</label>
                            <select
                                value={prefs.servings}
                                onChange={(e) => setPrefs({ ...prefs, servings: e.target.value })}
                                className="w-full bg-[#FEFAE0]/60 border border-[#2D6A4F]/15 rounded-lg px-3 py-2 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition"
                            >
                                <option value="1">1 person</option>
                                <option value="2">2 people</option>
                                <option value="4">4 people</option>
                                <option value="6">6 people</option>
                            </select>
                        </div>
                    </div>
                </div>

                {generationsLeft !== null && (
                    <p className="text-xs text-[#7A7A6E] text-center mb-3">
                        {generationsLeft} generation{generationsLeft !== 1 ? "s" : ""} remaining today
                    </p>
                )}

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={ingredients.length === 0 || loading}
                    className="w-full bg-[#2D6A4F] hover:bg-[#1e5038] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-full text-sm transition shadow-xl shadow-[#2D6A4F]/25 hover:-translate-y-0.5 mb-8"
                >
                    {loading
                        ? "Generating recipes..."
                        : ingredients.length === 0
                            ? "Add at least one ingredient to generate"
                            : `Generate recipes with ${ingredients.length} ingredient${ingredients.length > 1 ? "s" : ""}`}
                </button>

                {/* Error */}
                {error && (
                    <div className="bg-[#f5ede8] text-[#774936] text-sm px-4 py-3 rounded-lg mb-6 border border-[#774936]/20">
                        {error}
                    </div>
                )}

                {/* Recipe Cards */}
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

                {!loading && recipes.length > 0 && (
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                            ✦ AI Generated
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#1B1B1B] mb-4">
                            Here's what you can make 🍳
                        </h3>
                        <div className="space-y-4">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe._id}
                                    className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-serif text-lg font-bold text-[#1B1B1B]">
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
                                        className="text-sm text-[#2D6A4F] font-medium hover:underline"
                                    >
                                        View full recipe →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
