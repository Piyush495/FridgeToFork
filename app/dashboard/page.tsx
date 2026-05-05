"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

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
            const res = await fetch("/api/user/generations-left");
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
        <main className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-green-600">🍴 FridgeToFork</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Hey, {session?.user?.name?.split(" ")[0]} 👋
                    </span>
                    <Link
                        href="/my-recipes"
                        className="text-sm text-gray-500 hover:text-gray-800 transition"
                    >
                        My Recipes
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm text-gray-500 hover:text-red-500 transition"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    What's in your fridge?
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                    Add your ingredients and we'll generate recipes you can make right now.
                </p>

                {/* Ingredient Input */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                        Add ingredients
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. tomato, eggs, paneer..."
                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <button
                            onClick={addIngredient}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            Add
                        </button>
                    </div>

                    {ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {ingredients.map((item) => (
                                <span
                                    key={item}
                                    className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full border border-green-100"
                                >
                                    {item}
                                    <button
                                        onClick={() => removeIngredient(item)}
                                        className="text-green-400 hover:text-red-400 transition text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Your preferences
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Diet</label>
                            <select
                                value={prefs.diet}
                                onChange={(e) => setPrefs({ ...prefs, diet: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="none">No restriction</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Cuisine</label>
                            <select
                                value={prefs.cuisine}
                                onChange={(e) => setPrefs({ ...prefs, cuisine: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="any">Any</option>
                                <option value="indian">Indian</option>
                                <option value="italian">Italian</option>
                                <option value="chinese">Chinese</option>
                                <option value="mexican">Mexican</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Max cook time</label>
                            <select
                                value={prefs.cookTime}
                                onChange={(e) => setPrefs({ ...prefs, cookTime: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Servings</label>
                            <select
                                value={prefs.servings}
                                onChange={(e) => setPrefs({ ...prefs, servings: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
                    <p className="text-xs text-gray-400 text-center mb-2">
                        {generationsLeft} generation{generationsLeft !== 1 ? "s" : ""} remaining today
                    </p>
                )}

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={ingredients.length === 0 || loading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition mb-8"
                >
                    {loading
                        ? "Generating recipes..."
                        : ingredients.length === 0
                            ? "Add at least one ingredient to generate"
                            : `Generate recipes with ${ingredients.length} ingredient${ingredients.length > 1 ? "s" : ""}`}
                </button>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Recipe Cards */}
                {recipes.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Here's what you can make 🍳
                        </h3>
                        <div className="space-y-4">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-base font-bold text-gray-800">
                                            {recipe.name}
                                        </h4>
                                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 flex-shrink-0 ml-2">
                                            {recipe.cuisineType}
                                        </span>
                                    </div>

                                    <div className="flex gap-4 text-xs text-gray-500 mb-4">
                                        <span>⏱ {recipe.cookTime} mins</span>
                                        <span>👥 {recipe.servings} servings</span>
                                        <span>💪 {recipe.macros?.protein}g protein</span>
                                    </div>

                                    <Link
                                        href={`/recipe/${recipe._id}`}
                                        className="text-sm text-green-600 font-medium hover:underline"
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