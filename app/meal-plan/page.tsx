"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface DayPlan {
    day: string;
    recipeId: string | null;
    recipeName: string | null;
}

interface SavedRecipe {
    _id: string;
    name: string;
    cookTime: number;
    cuisineType: string;
}

export default function MealPlanPage() {
    const { data: session } = useSession();
    const [plan, setPlan] = useState<DayPlan[]>(
        DAYS.map((day) => ({ day, recipeId: null, recipeName: null }))
    );
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [planRes, recipesRes] = await Promise.all([
                fetch("/api/meal-plan"),
                fetch("/api/recipes"),
            ]);
            const planData = await planRes.json();
            const recipesData = await recipesRes.json();
            setPlan(planData.plan.days);
            setSavedRecipes(recipesData.recipes || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    const assignRecipe = async (day: string, recipe: SavedRecipe) => {
        setUpdating(day);
        const res = await fetch("/api/meal-plan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                day,
                recipeId: recipe._id,
                recipeName: recipe.name,
            }),
        });

        if (res.ok) {
            setPlan((prev) =>
                prev.map((d) =>
                    d.day === day
                        ? { ...d, recipeId: recipe._id, recipeName: recipe.name }
                        : d
                )
            );
        }
        setUpdating(null);
        setActiveDay(null);
    };

    const clearDay = async (day: string) => {
        setUpdating(day);
        await fetch("/api/meal-plan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, recipeId: null, recipeName: null }),
        });
        setPlan((prev) =>
            prev.map((d) =>
                d.day === day ? { ...d, recipeId: null, recipeName: null } : d
            )
        );
        setUpdating(null);
    };

    const filledDays = plan.filter((d) => d.recipeId).length;

    return (
        <main className="min-h-screen bg-[#FEFAE0]">
            {/* Navbar */}
            <nav className="bg-[#FEFAE0]/85 backdrop-blur-md border-b border-[#2D6A4F]/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <Link href="/dashboard" className="font-serif text-lg sm:text-xl font-black text-[#2D6A4F] tracking-tight">
                    Fridge<span className="text-[#774936]">To</span>Fork
                </Link>
                <div className="flex items-center gap-3 sm:gap-5">
                    <Link href="/dashboard" className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition hidden sm:inline">
                        Dashboard
                    </Link>
                    <Link href="/my-recipes" className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition hidden sm:inline">
                        My Recipes
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
                <div className="flex items-center justify-between mb-2 gap-3">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#1B1B1B] tracking-tight">Weekly Meal Plan</h2>
                    <span className="text-sm text-[#7A7A6E] flex-shrink-0">{filledDays}/7 planned</span>
                </div>
                <p className="text-[#7A7A6E] text-base mb-8 font-light">
                    Assign saved recipes to each day of the week.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#2D6A4F]/10 rounded-full h-2 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-[#2D6A4F] to-[#52B788] h-2 rounded-full transition-all"
                        style={{ width: `${(filledDays / 7) * 100}%` }}
                    />
                </div>

                {loading ? (
                    <p className="text-center text-[#7A7A6E] text-sm py-20">Loading your plan...</p>
                ) : (
                    <div className="space-y-3">
                        {plan.map((dayPlan) => (
                            <div
                                key={dayPlan.day}
                                className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-xs font-medium text-[#2D6A4F] uppercase tracking-widest w-24">
                                            {dayPlan.day}
                                        </span>
                                        {dayPlan.recipeName ? (
                                            <span className="text-sm font-medium text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1 rounded-full border border-[#52B788]/30 truncate max-w-[160px] sm:max-w-none">
                                                {dayPlan.recipeName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-[#7A7A6E]/70 italic">No recipe assigned</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {dayPlan.recipeId && (
                                            <button
                                                onClick={() => clearDay(dayPlan.day)}
                                                disabled={updating === dayPlan.day}
                                                className="text-xs text-[#7A7A6E] hover:text-[#774936] transition"
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                setActiveDay(
                                                    activeDay === dayPlan.day ? null : dayPlan.day
                                                )
                                            }
                                            className="text-xs bg-[#2D6A4F] hover:bg-[#1e5038] text-white px-4 py-1.5 rounded-full font-medium transition shadow-sm shadow-[#2D6A4F]/20"
                                        >
                                            {activeDay === dayPlan.day ? "Cancel" : dayPlan.recipeId ? "Change" : "Assign"}
                                        </button>
                                    </div>
                                </div>

                                {/* Recipe picker dropdown */}
                                {activeDay === dayPlan.day && (
                                    <div className="mt-4 border-t border-[#2D6A4F]/10 pt-4">
                                        {savedRecipes.length === 0 ? (
                                            <p className="text-sm text-[#7A7A6E]">
                                                No saved recipes yet.{" "}
                                                <Link href="/dashboard" className="text-[#2D6A4F] font-medium hover:underline">
                                                    Generate some first!
                                                </Link>
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {savedRecipes.map((recipe) => (
                                                    <button
                                                        key={recipe._id}
                                                        onClick={() => assignRecipe(dayPlan.day, recipe)}
                                                        disabled={updating === dayPlan.day}
                                                        className="w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#2D6A4F]/10 hover:border-[#2D6A4F]/40 hover:bg-[#FEFAE0]/60 transition text-sm"
                                                    >
                                                        <span className="font-medium text-[#1B1B1B]">
                                                            {recipe.name}
                                                        </span>
                                                        <span className="text-xs text-[#7A7A6E]">
                                                            {recipe.cookTime} mins · {recipe.cuisineType}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Shopping list CTA */}
                {filledDays >= 3 && (
                    <div className="mt-8 bg-[#2D6A4F] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
                        <p className="font-serif text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                            🛒 Ready to generate your shopping list?
                        </p>
                        <p className="text-white/70 text-sm mb-6 font-light">
                            You have {filledDays} days planned — we can generate a full shopping list!
                        </p>
                        <Link
                            href="/shopping-list"
                            className="inline-block bg-white text-[#2D6A4F] px-6 sm:px-8 py-3 rounded-full font-medium hover:-translate-y-0.5 hover:shadow-xl transition-all text-sm"
                        >
                            Generate shopping list
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
