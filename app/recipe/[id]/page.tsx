"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading recipe...</p>
            </main>
        );
    }

    if (!recipe) return null;

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-green-600">🍴 FridgeToFork</h1>
                <Link
                    href="/dashboard"
                    className="text-sm text-gray-500 hover:text-gray-800 transition"
                >
                    ← Back to dashboard
                </Link>
            </nav>

            <div className="max-w-2xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
                        <span className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex-shrink-0 ml-3">
                            {recipe.cuisineType}
                        </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">⏱ {recipe.cookTime} mins</span>
                        <span className="flex items-center gap-1">👥 {recipe.servings} servings</span>
                        <span className="flex items-center gap-1">💪 {recipe.macros?.protein}g protein</span>
                        <span className="flex items-center gap-1">🌾 {recipe.macros?.carbs}g carbs</span>
                        <span className="flex items-center gap-1">🧈 {recipe.macros?.fat}g fat</span>
                    </div>

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={saved || saving}
                        className="w-full border border-green-500 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2.5 rounded-xl text-sm transition"
                    >
                        {saved ? "✓ Saved to my recipes" : saving ? "Saving..." : "Save this recipe"}
                    </button>
                </div>

                {/* Ingredients */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-4">
                        Ingredients
                    </h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ing, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-3 text-sm text-gray-700"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                                <span>
                                    {ing.amount} {ing.unit} {ing.item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-bold text-gray-800 mb-4">
                        Instructions
                    </h3>
                    <ol className="space-y-4">
                        {recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-4 text-sm text-gray-700">
                                <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                                    {i + 1}
                                </span>
                                <p className="leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </main>
    );
}