"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

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
            try {
                const [planRes, recipesRes] = await Promise.all([
                    fetch("/api/meal-plan"),
                    fetch("/api/recipes"),
                ]);
                const planData = await planRes.json();
                const recipesData = await recipesRes.json();
                if (planData?.plan?.days) {
                    setPlan(planData.plan.days);
                }
                setSavedRecipes(recipesData.recipes || []);
            } catch (err) {
                console.error("Failed to load meal plan data", err);
            } finally {
                setLoading(false);
            }
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
            toast.success(`Assigned to ${day}`);
        } else {
            toast.error("Failed to assign recipe");
        }
        setUpdating(null);
        setActiveDay(null);
    };

    const clearDay = async (day: string) => {
        setUpdating(day);
        const res = await fetch("/api/meal-plan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, recipeId: null, recipeName: null }),
        });
        if (res.ok) {
            setPlan((prev) =>
                prev.map((d) =>
                    d.day === day ? { ...d, recipeId: null, recipeName: null } : d
                )
            );
            toast.success(`Removed recipe from ${day}`);
        } else {
            toast.error("Failed to remove recipe");
        }
        setUpdating(null);
    };

    const filledDays = plan.filter((d) => d.recipeId).length;

    const getDayAbbr = (day: string) => {
        return day.substring(0, 3).toUpperCase();
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#F4F9F4] via-white to-[#EAF5EB] flex flex-col relative overflow-x-hidden">
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
                <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                        href="/dashboard"
                        className="text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition hidden sm:flex items-center gap-1.5 font-medium"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link
                        href="/my-recipes"
                        className="text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition hidden sm:flex items-center gap-1.5 font-medium"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        My Recipes
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm text-[#2D6A4F] font-semibold border border-[#2D6A4F]/25 px-4 py-1.5 rounded-xl hover:bg-[#2D6A4F] hover:text-white transition flex items-center gap-1.5"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign out
                    </button>
                </div>
            </nav>

            {/* Background Decorative Food Graphics */}
            {/* Top-left dot grid */}
            <div className="hidden lg:block absolute top-12 left-16 opacity-30 pointer-events-none select-none">
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
                    ))}
                </div>
            </div>

            {/* Bottom-left dot grid */}
            <div className="hidden lg:block absolute bottom-12 left-20 opacity-30 pointer-events-none select-none">
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
                    ))}
                </div>
            </div>

            {/* Right middle dot grid */}
            <div className="hidden lg:block absolute top-1/3 right-16 opacity-30 pointer-events-none select-none">
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
                    ))}
                </div>
            </div>

            {/* Left Decorative Food Asset */}
            <div className="hidden lg:block absolute left-0 bottom-[10%] w-[380px] xl:w-[440px] pointer-events-none select-none z-0 mix-blend-multiply opacity-95 transform -translate-x-[25%] hover:-translate-x-[20%] transition-all duration-300">
                <img src="/auth-food.png" alt="Ingredients decor" className="w-full h-auto object-contain" />
            </div>

            {/* Right Salad Plate Graphic */}
            <div className="hidden lg:block absolute right-0 top-[10%] xl:top-[12%] w-[420px] h-[420px] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.98] transition-all duration-300 transform translate-x-[45%] hover:translate-x-[40%]">
                <div className="w-full h-full bg-[url('/dashboard-food.png')] bg-[length:300%_auto] bg-[position:100%_center] bg-no-repeat"/>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 flex-1 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-6">
                    <div className="flex items-center gap-5 text-center sm:text-left">
                        {/* Big Calendar Icon Circle */}
                        <div className="w-20 h-20 rounded-full bg-[#F2F7F4] border border-[#52B788]/20 flex items-center justify-center text-[#2D6A4F] flex-shrink-0 shadow-inner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-10 h-10">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                                <circle cx="12" cy="12" r="1" fill="currentColor" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1B1B1B] tracking-tight">
                                    Weekly Meal Plan
                                </h2>
                                <span className="text-2xl">🍃</span>
                            </div>
                            <p className="text-[#7A7A6E] text-sm sm:text-base font-normal mt-1">
                                Assign saved recipes to each day of the week.
                            </p>
                        </div>
                    </div>

                    {/* Progress Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#F2F7F4] text-[#2D6A4F] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#52B788]/20 flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{filledDays}/7 planned</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#2D6A4F]/10 rounded-full h-2 mb-8 overflow-hidden">
                    <div
                        className="bg-[#2D6A4F] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(filledDays / 7) * 100}%` }}
                    />
                </div>

                {/* Day Cards List */}
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 h-20" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {plan.map((dayPlan) => {
                            const isAssigned = Boolean(dayPlan.recipeId && dayPlan.recipeName);
                            const isActive = activeDay === dayPlan.day;
                            const currentRecipe = savedRecipes.find((r) => r._id === dayPlan.recipeId);

                            return (
                                <div
                                    key={dayPlan.day}
                                    className={`bg-white rounded-2xl transition-all ${
                                        isActive
                                            ? "border-2 border-[#2D6A4F]/40 shadow-md p-5 sm:p-6"
                                            : "border border-black/5 shadow-sm p-4 sm:p-5 hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        
                                        {/* Left Side: Day Icon & Name & Status */}
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {/* Square Day Badge */}
                                            <div className="w-11 h-11 rounded-xl bg-[#F2F7F4] flex items-center justify-center text-[#2D6A4F] font-bold text-xs flex-shrink-0 border border-[#52B788]/20">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                                </svg>
                                            </div>

                                            {/* Day Name */}
                                            <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest min-w-[80px]">
                                                {dayPlan.day}
                                            </span>

                                            {/* Status / Recipe Pill */}
                                            {isAssigned && !isActive ? (
                                                <span className="bg-[#D8F3DC] text-[#2D6A4F] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#52B788]/30 flex items-center gap-1.5">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                                    </svg>
                                                    {dayPlan.recipeName}
                                                </span>
                                            ) : (
                                                <span className={`text-xs sm:text-sm italic ${isAssigned ? "text-[#52B788] font-medium" : "text-[#7A7A6E]/70"}`}>
                                                    {isAssigned ? "Recipe assigned" : "No recipe assigned"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Right Side: Action Buttons */}
                                        <div className="flex items-center gap-3">
                                            {isAssigned && !isActive && (
                                                <button
                                                    onClick={() => clearDay(dayPlan.day)}
                                                    disabled={updating === dayPlan.day}
                                                    className="text-xs text-[#7A7A6E] hover:text-red-600 transition font-medium px-2 py-1"
                                                >
                                                    Remove
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setActiveDay(isActive ? null : dayPlan.day)}
                                                className={`text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                                                    isActive
                                                        ? "text-red-600 border border-red-200 bg-red-50 hover:bg-red-100"
                                                        : isAssigned
                                                        ? "text-[#2D6A4F] border border-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white"
                                                        : "bg-[#2D6A4F] hover:bg-[#1e5038] text-white shadow-sm"
                                                }`}
                                            >
                                                {isActive ? (
                                                    <>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                        </svg>
                                                        Cancel
                                                    </>
                                                ) : isAssigned ? (
                                                    <>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                        Change
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-sm">+</span>
                                                        Assign
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Assigned Card Preview Box inside active state */}
                                    {isActive && isAssigned && currentRecipe && (
                                        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 flex items-center justify-between flex-wrap gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                                    </svg>
                                                </div>
                                                <span className="font-bold text-sm text-[#1B1B1B]">
                                                    {currentRecipe.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-[#7A7A6E]">
                                                <span className="flex items-center gap-1">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#2D6A4F]">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                    {currentRecipe.cookTime} mins
                                                </span>
                                                <span>|</span>
                                                <span className="flex items-center gap-1">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#2D6A4F]">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <line x1="2" y1="12" x2="22" y2="12"/>
                                                    </svg>
                                                    {currentRecipe.cuisineType}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recipe Picker Dropdown when active */}
                                    {isActive && (
                                        <div className="mt-4 border-t border-[#2D6A4F]/10 pt-4">
                                            <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider mb-3">
                                                Select a recipe to assign to {dayPlan.day}:
                                            </p>
                                            {savedRecipes.length === 0 ? (
                                                <div className="bg-[#F4F9F4] rounded-xl p-4 text-center">
                                                    <p className="text-xs text-[#7A7A6E] mb-2">
                                                        No saved recipes found.
                                                    </p>
                                                    <Link href="/dashboard" className="text-xs text-[#2D6A4F] font-bold hover:underline">
                                                        Generate recipes on Dashboard →
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                    {savedRecipes.map((recipe) => (
                                                        <button
                                                            key={recipe._id}
                                                            onClick={() => assignRecipe(dayPlan.day, recipe)}
                                                            disabled={updating === dayPlan.day}
                                                            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border transition text-xs sm:text-sm ${
                                                                dayPlan.recipeId === recipe._id
                                                                    ? "border-[#2D6A4F] bg-[#D8F3DC]/40 font-bold"
                                                                    : "border-gray-200 hover:border-[#2D6A4F]/40 hover:bg-[#F4F9F4]"
                                                            }`}
                                                        >
                                                            <span className="font-semibold text-[#1B1B1B] truncate max-w-[200px] sm:max-w-none">
                                                                {recipe.name}
                                                            </span>
                                                            <span className="text-xs text-[#7A7A6E] flex-shrink-0">
                                                                ⏱ {recipe.cookTime} mins · {recipe.cuisineType}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
