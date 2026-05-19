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
    }, [id]);

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
            <main className="min-h-screen bg-[#FEFAE0]">
                <nav className="bg-[#FEFAE0]/85 backdrop-blur-md border-b border-[#2D6A4F]/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                    <Link href="/dashboard" className="font-serif text-lg sm:text-xl font-black text-[#2D6A4F] tracking-tight">
                        Fridge<span className="text-[#774936]">To</span>Fork
                    </Link>
                    <Link href="/dashboard" className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition">
                        ← Back
                    </Link>
                </nav>
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <SkeletonRecipeDetail />
                </div>
            </main>
        );
    }

    if (!recipe) return null;

    return (
        <main className="min-h-screen bg-[#FEFAE0]">
            {/* Navbar */}
            <nav className="bg-[#FEFAE0]/85 backdrop-blur-md border-b border-[#2D6A4F]/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <Link href="/dashboard" className="font-serif text-lg sm:text-xl font-black text-[#2D6A4F] tracking-tight">
                    Fridge<span className="text-[#774936]">To</span>Fork
                </Link>
                <Link
                    href="/dashboard"
                    className="text-sm text-[#7A7A6E] hover:text-[#2D6A4F] transition"
                >
                    ← Back
                </Link>
            </nav>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6 mb-5">
                    <div className="flex items-start justify-between mb-4 gap-3">
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1B1B] tracking-tight leading-tight">{recipe.name}</h2>
                        <span className="text-xs bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1.5 rounded-full border border-[#52B788]/30 flex-shrink-0 font-medium">
                            {recipe.cuisineType}
                        </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#7A7A6E] mb-6">
                        <span className="flex items-center gap-1.5">⏱ {recipe.cookTime} mins</span>
                        <span className="flex items-center gap-1.5">👥 {recipe.servings} servings</span>
                        <span className="flex items-center gap-1.5">💪 {recipe.macros?.protein}g protein</span>
                        <span className="flex items-center gap-1.5">🌾 {recipe.macros?.carbs}g carbs</span>
                        <span className="flex items-center gap-1.5">🧈 {recipe.macros?.fat}g fat</span>
                    </div>

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={saved || saving}
                        className={`w-full font-medium py-3 rounded-full text-sm transition ${saved
                            ? "bg-[#D8F3DC] text-[#2D6A4F] border border-[#52B788]/30 cursor-default"
                            : "bg-[#2D6A4F] hover:bg-[#1e5038] text-white shadow-lg shadow-[#2D6A4F]/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                            }`}
                    >
                        {saved ? "✓ Saved to my recipes" : saving ? "Saving..." : "Save this recipe"}
                    </button>
                </div>

                {/* Ingredients */}
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6 mb-5">
                    <h3 className="font-serif text-xl font-bold text-[#1B1B1B] mb-4">
                        Ingredients
                    </h3>
                    <ul className="space-y-2.5">
                        {recipe.ingredients.map((ing, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-3 text-sm text-[#1B1B1B]"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] flex-shrink-0" />
                                <span>
                                    <span className="font-medium">{ing.amount} {ing.unit}</span>{" "}
                                    <span className="text-[#7A7A6E]">{ing.item}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6">
                    <h3 className="font-serif text-xl font-bold text-[#1B1B1B] mb-4">
                        Instructions
                    </h3>
                    <ol className="space-y-4">
                        {recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-4 text-sm text-[#1B1B1B]">
                                <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold shadow-sm shadow-[#2D6A4F]/30">
                                    {i + 1}
                                </span>
                                <p className="leading-relaxed pt-0.5">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </main>
    );
}
