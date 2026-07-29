"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { SkeletonMyRecipes } from "@/components/Skeleton";
import toast from "react-hot-toast";

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
    
    // Delete Confirmation Modal State
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    const confirmDeleteRecipe = async () => {
        if (!recipeToDelete) return;
        setDeleting(true);

        try {
            const res = await fetch(`/api/recipes/${recipeToDelete._id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Failed to delete recipe");
                setDeleting(false);
                return;
            }

            const updatedRecipes = recipes.filter((r) => r._id !== recipeToDelete._id);
            setRecipes(updatedRecipes);
            if (activeFilter === "All") {
                setFiltered(updatedRecipes);
            } else {
                setFiltered(
                    updatedRecipes.filter(
                        (r) => r.cuisineType?.toLowerCase() === activeFilter.toLowerCase()
                    )
                );
            }

            toast.success("Recipe deleted successfully");
            setRecipeToDelete(null);
        } catch (err) {
            toast.error("An error occurred while deleting");
        } finally {
            setDeleting(false);
        }
    };

    const renderRecipeIcon = (index: number) => {
        const icons = [
            // Skillet Pan
            <svg key="pan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <path d="M3 11h14v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2z" />
                <path d="M17 14h4" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M7 6c0 1.5 1 2 1 3M11 6c0 1.5 1 2 1 3M15 6c0 1.5 1 2 1 3" strokeLinecap="round" />
            </svg>,
            // Salad Bowl
            <svg key="bowl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <path d="M4 11a8 8 0 0 0 16 0H4z" />
                <path d="M7 7c1-1 3-1 4 0M13 7c1-1 3-1 4 0" strokeLinecap="round" />
            </svg>,
            // Cooking Pot
            <svg key="pot" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <rect x="4" y="9" width="16" height="11" rx="3" />
                <path d="M2 12h2M20 12h2" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M7 5a3 3 0 0 1 10 0" strokeLinecap="round" />
            </svg>
        ];
        return icons[index % icons.length];
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
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-xs sm:text-sm text-[#2D6A4F] font-semibold border border-[#2D6A4F]/25 px-3 sm:px-4 py-1.5 rounded-xl hover:bg-[#2D6A4F] hover:text-white transition flex items-center gap-1"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span className="hidden xs:inline sm:inline">Sign out</span>
                    </button>
                </div>
            </nav>

            {/* Decorative Background Assets */}
            {/* Top-left dot grid */}
            <div className="hidden lg:block absolute top-12 left-24 opacity-30 pointer-events-none select-none">
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
                    ))}
                </div>
            </div>

            {/* Bottom-right dot grid */}
            <div className="hidden lg:block absolute bottom-12 right-28 opacity-30 pointer-events-none select-none">
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/30"/>
                    ))}
                </div>
            </div>

            {/* Left Cutting Board Graphic */}
            <div className="hidden lg:block absolute left-0 bottom-[5%] w-[380px] xl:w-[440px] pointer-events-none select-none z-0 mix-blend-multiply opacity-95 transform -translate-x-[25%] hover:-translate-x-[20%] transition-all duration-300">
                <img src="/auth-food.png" alt="Ingredients decor" className="w-full h-auto object-contain" />
            </div>

            {/* Right Salad Plate Graphic */}
            <div className="hidden lg:block absolute right-0 top-[10%] xl:top-[12%] w-[420px] h-[420px] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.98] transition-all duration-300 transform translate-x-[45%] hover:translate-x-[40%]">
                <div className="w-full h-full bg-[url('/dashboard-food.png')] bg-[length:300%_auto] bg-[position:100%_center] bg-no-repeat"/>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 flex-1 relative z-10">
                <div className="flex items-center justify-between mb-2 gap-3">
                    <div className="flex items-center gap-2">
                        <h2 className="font-serif text-4xl sm:text-5xl font-black text-[#1B1B1B] tracking-tight">
                            My Recipes
                        </h2>
                        <span className="text-[#2D6A4F] text-2xl sm:text-3xl">🍃</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#D8F3DC] text-[#2D6A4F] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#52B788]/30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span>{filtered.length} saved</span>
                    </div>
                </div>
                <p className="text-[#7A7A6E] text-base mb-8 font-light">
                    All your saved recipes in one place.
                </p>

                {/* Cuisine filter chips */}
                <div className="flex flex-wrap gap-2.5 mb-8">
                    {CUISINE_FILTERS.map((cuisine) => (
                        <button
                            key={cuisine}
                            onClick={() => handleFilter(cuisine)}
                            className={`text-sm px-5 py-2 rounded-full border transition-all font-medium ${
                                activeFilter === cuisine
                                    ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-md shadow-[#2D6A4F]/20"
                                    : "bg-white text-[#2D6A4F] border-[#2D6A4F]/20 hover:border-[#2D6A4F] hover:bg-[#F4F9F4]"
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
                    <div className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm">
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
                        {filtered.map((recipe, index) => (
                            <Link
                                key={recipe._id}
                                href={`/recipe/${recipe._id}`}
                                className="flex items-center gap-5 bg-white rounded-3xl border border-black/5 shadow-sm p-5 sm:p-6 hover:-translate-y-0.5 hover:shadow-md transition-all group relative"
                            >
                                {/* Left Category Icon Container */}
                                <div className="w-14 h-14 rounded-2xl bg-[#F2F7F4] flex items-center justify-center text-[#2D6A4F] flex-shrink-0 group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors duration-300">
                                    {renderRecipeIcon(index)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-start justify-between mb-2 gap-2">
                                        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1B1B1B] group-hover:text-[#2D6A4F] transition truncate">
                                            {recipe.name}
                                        </h4>
                                        <span className="text-xs bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-full border border-[#52B788]/30 flex-shrink-0 font-medium">
                                            {recipe.cuisineType}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-[#7A7A6E] font-medium">
                                        <span className="flex items-center gap-1">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#2D6A4F]">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {recipe.cookTime} mins
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#2D6A4F]">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            {recipe.servings} servings
                                        </span>
                                        {recipe.macros?.protein && (
                                            <span className="flex items-center gap-1">
                                                <span className="text-[#2D6A4F]">💪</span>
                                                {recipe.macros.protein}g protein
                                            </span>
                                        )}
                                        {recipe.macros?.carbs && (
                                            <span className="flex items-center gap-1">
                                                <span className="text-[#2D6A4F]">🌾</span>
                                                {recipe.macros.carbs}g carbs
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Cross Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setRecipeToDelete(recipe);
                                    }}
                                    className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-200 z-10"
                                    title="Delete recipe"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Popup Modal */}
            {recipeToDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-black/5 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
                        {/* Icon Header */}
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>

                        {/* Text */}
                        <div className="text-center space-y-2">
                            <h3 className="font-serif text-2xl font-bold text-[#1B1B1B]">
                                Delete Recipe?
                            </h3>
                            <p className="text-sm text-[#7A7A6E] font-light leading-relaxed">
                                Are you sure you want to delete <span className="font-semibold text-[#1B1B1B]">&ldquo;{recipeToDelete.name}&rdquo;</span>? This action cannot be undone.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setRecipeToDelete(null)}
                                disabled={deleting}
                                className="flex-1 py-3 px-4 border border-gray-200 hover:border-gray-300 rounded-xl font-medium text-sm text-[#1B1B1B] hover:bg-gray-50 transition"
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={confirmDeleteRecipe}
                                disabled={deleting}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-red-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
