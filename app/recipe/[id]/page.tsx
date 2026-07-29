"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SkeletonRecipeDetail } from "@/components/Skeleton";

interface Recipe {
    _id: string;
    name: string;
    cookTime: number;
    servings: number;
    cuisineType: string;
    macros: { protein: number; carbs: number; fat: number };
    ingredients: { item: string; amount: string; unit: string }[];
    steps: string[];
    isSaved: boolean;
}

export default function RecipePage() {
    const { id } = useParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await fetch(`/api/recipes/${id}`);
            if (!res.ok) {
                router.push("/dashboard");
                return;
            }
            const data = await res.json();
            setRecipe(data.recipe);
            setSaved(data.recipe.isSaved);
            setLoading(false);
        };

        fetchRecipe();
    }, [id, router]);

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch(`/api/recipes/${id}/save`, {
            method: "PATCH",
        });
        if (res.ok) setSaved(true);
        setSaving(false);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-[#F4F9F4] via-white to-[#EAF5EB] flex flex-col">
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
                            href="/meal-plan"
                            className="text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition hidden sm:flex items-center gap-1.5 font-medium"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Meal Plan
                        </Link>
                        <button
                            onClick={() => router.back()}
                            className="text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition flex items-center gap-1 font-medium"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back
                        </button>
                    </div>
                </nav>
                <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-12">
                    <SkeletonRecipeDetail />
                </div>
            </main>
        );
    }

    if (!recipe) return null;

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

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/dashboard"
                        className="text-xs sm:text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg hover:bg-[#F4F9F4]"
                        title="Dashboard"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                        </svg>
                        <span className="hidden sm:inline">Dashboard</span>
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
                        onClick={() => router.back()}
                        className="text-xs sm:text-sm text-[#1B1B1B] hover:text-[#2D6A4F] transition flex items-center gap-1 font-medium border border-[#2D6A4F]/20 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-[#F4F9F4]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                        <span className="hidden xs:inline sm:inline">Back</span>
                    </button>
                </div>
            </nav>

            {/* Decorative Background Assets */}
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

            {/* Left Cutting Board Graphic */}
            <div className="hidden lg:block absolute left-0 bottom-[10%] w-[380px] xl:w-[440px] pointer-events-none select-none z-0 mix-blend-multiply opacity-95 transform -translate-x-[25%] hover:-translate-x-[20%] transition-all duration-300">
                <img src="/auth-food.png" alt="Ingredients decor" className="w-full h-auto object-contain" />
            </div>

            {/* Right Salad Plate Graphic */}
            <div className="hidden lg:block absolute right-0 top-[10%] xl:top-[12%] w-[420px] h-[420px] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.98] transition-all duration-300 transform translate-x-[45%] hover:translate-x-[40%]">
                <div className="w-full h-full bg-[url('/dashboard-food.png')] bg-[length:300%_auto] bg-[position:100%_center] bg-no-repeat"/>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 flex-1 relative z-10 space-y-6">
                
                {/* Hero Header Card */}
                <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Circular Dish / Cookware Icon Container (No static vegetable images) */}
                        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#F4F9F4] flex items-center justify-center p-3 flex-shrink-0 border border-[#52B788]/20 shadow-inner relative text-[#2D6A4F]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 sm:w-20 sm:h-20">
                                <path d="M3 11h14v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2z" />
                                <path d="M17 14h4" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M7 6c0 1.5 1 2 1 3M11 6c0 1.5 1 2 1 3M15 6c0 1.5 1 2 1 3" strokeLinecap="round" />
                            </svg>
                        </div>

                        {/* Title & Stats */}
                        <div className="flex-1 w-full text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 mb-3">
                                {/* Recipe Name (No vegetable icon in heading) */}
                                <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1B1B1B] tracking-tight leading-tight">
                                    {recipe.name}
                                </h2>
                                <span className="text-xs bg-[#EAF5EB] text-[#2D6A4F] px-3.5 py-1 rounded-full border border-[#52B788]/30 flex-shrink-0 font-semibold">
                                    {recipe.cuisineType}
                                </span>
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-[#7A7A6E] font-medium mb-5">
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {recipe.cookTime} mins
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2D6A4F]">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    {recipe.servings} servings
                                </span>
                                {recipe.macros?.protein && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#2D6A4F]">💪</span>
                                        {recipe.macros.protein}g protein
                                    </span>
                                )}
                                {recipe.macros?.carbs && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#2D6A4F]">🌾</span>
                                        {recipe.macros.carbs}g carbs
                                    </span>
                                )}
                                {recipe.macros?.fat && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#2D6A4F]">🧈</span>
                                        {recipe.macros.fat}g fat
                                    </span>
                                )}
                            </div>

                            {/* Full-width Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={saved || saving}
                                className={`w-full font-semibold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 ${
                                    saved
                                        ? "bg-[#D8F3DC] text-[#2D6A4F] border border-[#52B788]/30 cursor-default"
                                        : "bg-[#2D6A4F] hover:bg-[#1e5038] text-white shadow-lg shadow-[#2D6A4F]/20 hover:-translate-y-0.5 disabled:opacity-50"
                                }`}
                            >
                                <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                </svg>
                                <span>{saved ? "Saved to my recipes" : saving ? "Saving..." : "Save this recipe"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2-Column Layout for Ingredients and Instructions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Ingredients Card */}
                    <div className="lg:col-span-5 bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8 relative overflow-hidden h-full flex flex-col">
                        <h3 className="font-serif text-2xl font-bold text-[#2D6A4F] flex items-center gap-2 pb-3 mb-4 border-b border-[#2D6A4F]/10">
                            Ingredients
                            <span className="text-xl">🍃</span>
                        </h3>

                        {/* Ingredients Bulleted List */}
                        <ul className="space-y-3.5 flex-1">
                            {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-[#1B1B1B]">
                                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] flex-shrink-0" />
                                    <span>
                                        <span className="font-bold">{ing.amount} {ing.unit}</span>{" "}
                                        <span className="text-[#1B1B1B] font-normal">{ing.item}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Bottom-Right Line Art Watermark */}
                        <div className="absolute right-3 bottom-3 w-28 h-28 opacity-15 pointer-events-none text-[#2D6A4F] hidden sm:block">
                            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                                <path d="M20 50 C20 75 80 75 80 50 Z" />
                                <path d="M30 45 C30 30 50 30 50 45 Z" />
                                <path d="M50 45 C50 25 70 25 70 45 Z" />
                                <path d="M35 30 Q50 15 65 30" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Column: Instructions Card */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8 relative overflow-hidden h-full">
                        <h3 className="font-serif text-2xl font-bold text-[#2D6A4F] flex items-center gap-2 pb-3 mb-4 border-b border-[#2D6A4F]/10">
                            Instructions
                            <span className="text-xl">🍃</span>
                        </h3>

                        {/* Timeline Step Sequence */}
                        <div className="space-y-6 relative">
                            {recipe.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-4 relative">
                                    {/* Dashed line connecting step dots */}
                                    {i < recipe.steps.length - 1 && (
                                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] border-l-2 border-dashed border-[#2D6A4F]/25 -z-0" />
                                    )}
                                    
                                    {/* Number Circle */}
                                    <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 z-10 shadow-sm shadow-[#2D6A4F]/20">
                                        {i + 1}
                                    </div>
                                    
                                    {/* Step text */}
                                    <p className="text-[#1B1B1B] text-sm sm:text-base leading-relaxed pt-0.5 flex-1 font-normal">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom-Right Line Art Watermark */}
                        <div className="absolute right-4 bottom-4 w-36 h-36 opacity-15 pointer-events-none text-[#2D6A4F] hidden sm:block">
                            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                                <path d="M20 50 A 25 15 0 0 0 70 50 Z" />
                                <path d="M70 50 L 90 35" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M35 30 Q 30 20 40 10" strokeDasharray="3 3" />
                                <path d="M48 30 Q 43 20 53 10" strokeDasharray="3 3" />
                                <path d="M60 30 Q 55 20 65 10" strokeDasharray="3 3" />
                            </svg>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}
