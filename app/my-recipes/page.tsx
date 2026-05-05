"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { SkeletonMyRecipes } from "@/components/Skeleton";

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
        <main className="min-h-screen bg-[#FEFAE0]">
            {/* Navbar */}
            <nav className="bg-[#FEFAE0]/85 backdrop-blur-md border-b border-[#2D6A4F]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <Link href="/dashboard" className="font-serif text-xl font-black text-[#2D6A4F] tracking-tight">
                    Fridge<span className="text-[#774936]">To</span>Fork
                </Link>
                <div className="flex items-center gap-5">
                    <Link
                        href="/dashboard"
                        className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/meal-plan"
                        className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition"
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

            <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-serif text-4xl md:text-5xl font-black text-[#1B1B1B] tracking-tight">My Recipes</h2>
                    <span className="text-sm text-[#7A7A6E]">{filtered.length} saved</span>
                </div>
                <p className="text-[#7A7A6E] text-base mb-8 font-light">
                    All your saved recipes in one place.
                </p>

                {/* Cuisine filter chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CUISINE_FILTERS.map((cuisine) => (
                        <button
                            key={cuisine}
                            onClick={() => handleFilter(cuisine)}
                            className={`text-sm px-4 py-1.5 rounded-full border transition ${activeFilter === cuisine
                                ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-md shadow-[#2D6A4F]/20"
                                : "bg-white text-[#7A7A6E] border-[#2D6A4F]/15 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                                }`}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>

                {/* Loading state */}
                {loading && <SkeletonMyRecipes />}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
                        <p className="text-5xl mb-4">🍽️</p>
                        <p className="font-serif text-xl font-bold text-[#1B1B1B] mb-1">No saved recipes yet</p>
                        <p className="text-[#7A7A6E] text-sm mb-6">
                            Generate some recipes and save your favourites!
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-block bg-[#2D6A4F] hover:bg-[#1e5038] text-white text-sm font-medium px-6 py-2.5 rounded-full transition shadow-lg shadow-[#2D6A4F]/25 hover:-translate-y-0.5"
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
                                className="block bg-white rounded-2xl border border-black/5 shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-serif text-lg font-bold text-[#1B1B1B]">
                                        {recipe.name}
                                    </h4>
                                    <span className="text-xs bg-[#D8F3DC] text-[#2D6A4F] px-2.5 py-1 rounded-full border border-[#52B788]/30 flex-shrink-0 ml-2 font-medium">
                                        {recipe.cuisineType}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs text-[#7A7A6E]">
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
