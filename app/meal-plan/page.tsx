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
        <main className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-green-600">🍴 FridgeToFork</h1>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800 transition">
                        Dashboard
                    </Link>
                    <Link href="/my-recipes" className="text-sm text-gray-500 hover:text-gray-800 transition">
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
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Weekly Meal Plan</h2>
                    <span className="text-sm text-gray-400">{filledDays}/7 days planned</span>
                </div>
                <p className="text-gray-500 text-sm mb-8">
                    Assign saved recipes to each day of the week.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
                    <div
                        className="bg-green-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${(filledDays / 7) * 100}%` }}
                    />
                </div>

                {loading ? (
                    <p className="text-center text-gray-400 text-sm py-20">Loading your plan...</p>
                ) : (
                    <div className="space-y-3">
                        {plan.map((dayPlan) => (
                            <div
                                key={dayPlan.day}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-gray-700 w-24">
                                            {dayPlan.day}
                                        </span>
                                        {dayPlan.recipeName ? (
                                            <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                {dayPlan.recipeName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">No recipe assigned</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {dayPlan.recipeId && (
                                            <button
                                                onClick={() => clearDay(dayPlan.day)}
                                                disabled={updating === dayPlan.day}
                                                className="text-xs text-gray-400 hover:text-red-400 transition"
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
                                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition"
                                        >
                                            {activeDay === dayPlan.day ? "Cancel" : dayPlan.recipeId ? "Change" : "Assign"}
                                        </button>
                                    </div>
                                </div>

                                {/* Recipe picker dropdown */}
                                {activeDay === dayPlan.day && (
                                    <div className="mt-4 border-t border-gray-50 pt-4">
                                        {savedRecipes.length === 0 ? (
                                            <p className="text-sm text-gray-400">
                                                No saved recipes yet.{" "}
                                                <Link href="/dashboard" className="text-green-600 hover:underline">
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
                                                        className="w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition text-sm"
                                                    >
                                                        <span className="font-medium text-gray-700">
                                                            {recipe.name}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
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
                    <div className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                        <p className="text-sm font-medium text-green-800 mb-1">
                            🛒 Ready to generate your shopping list?
                        </p>
                        <p className="text-xs text-green-600 mb-4">
                            You have {filledDays} days planned — we can generate a full shopping list!
                        </p>
                        <Link
                            href="/shopping-list"
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition inline-block"
                        >
                            Generate shopping list
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}