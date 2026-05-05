"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface Recipe {
    _id: string;
    name: string;
    cookTime: number;
    servings: number;
    cuisineType: string;
    macros: { protein: number; carbs: number; fat: number };
}

const CUISINE_FILTERS = ["All", "Indian", "Italian", "Chinese", "Mexican", "Any"];

export default function MyRecipesPage() {
    const { data: session } = useSession();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filtered, setFiltered] = useState<Recipe[]>([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            const res = await fetch("/api/recipes");
            const data = await res.json();
            setRecipes(data.recipes || []);
            setFiltered(data.recipes || []);
            setLoading(false);
        };
        fetchRecipes();
    }, []);

    const handleFilter = (cuisine: string) => {
        setActiveFilter(cuisine);
        if (cuisine === "All") {
            setFiltered(recipes);
        } else {
            setFiltered(
                recipes.filter(
                    (r) => r.cuisineType?.toLowerCase() === cuisine.toLowerCase()
                )
            );
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-green-600">🍴 FridgeToFork</h1>
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="text-sm text-gray-500 hover:text-gray-800 transition"
                    >
                        Dashboard
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
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">My Recipes</h2>
                    <span className="text-sm text-gray-400">{filtered.length} saved</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                    All your saved recipes in one place.
                </p>

                {/* Cuisine filter chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CUISINE_FILTERS.map((cuisine) => (
                        <button
                            key={cuisine}
                            onClick={() => handleFilter(cuisine)}
                            className={`text-sm px-4 py-1.5 rounded-full border transition ${activeFilter === cuisine
                                    ? "bg-green-500 text-white border-green-500"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                                }`}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-sm">Loading your recipes...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-4">🍽️</p>
                        <p className="text-gray-600 font-medium mb-1">No saved recipes yet</p>
                        <p className="text-gray-400 text-sm mb-6">
                            Generate some recipes and save your favourites!
                        </p>
                        <Link
                            href="/dashboard"
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition"
                        >
                            Go to dashboard
                        </Link>
                    </div>
                )}

                {/* Recipe grid */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-4">
                        {filtered.map((recipe) => (
                            <Link
                                key={recipe._id}
                                href={`/recipe/${recipe._id}`}
                                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-green-200 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-base font-bold text-gray-800">
                                        {recipe.name}
                                    </h4>
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 flex-shrink-0 ml-2">
                                        {recipe.cuisineType}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                    <span>⏱ {recipe.cookTime} mins</span>
                                    <span>👥 {recipe.servings} servings</span>
                                    <span>💪 {recipe.macros?.protein}g protein</span>
                                    <span>🌾 {recipe.macros?.carbs}g carbs</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}