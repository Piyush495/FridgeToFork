export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="h-5 bg-[#2D6A4F]/10 rounded-full w-48" />
                <div className="h-6 bg-[#D8F3DC] rounded-full w-16" />
            </div>
            <div className="flex gap-4 mb-4">
                <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-20" />
                <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-20" />
                <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-20" />
            </div>
            <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-28" />
        </div>
    );
}

export function SkeletonRecipeDetail() {
    return (
        <div className="animate-pulse">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-8 bg-[#2D6A4F]/10 rounded-full w-64" />
                    <div className="h-6 bg-[#D8F3DC] rounded-full w-20" />
                </div>
                <div className="flex gap-4 mb-6">
                    <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-24" />
                    <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-24" />
                    <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-24" />
                </div>
                <div className="h-11 bg-[#2D6A4F]/15 rounded-full w-full" />
            </div>

            {/* Ingredients card */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-5">
                <div className="h-5 bg-[#2D6A4F]/10 rounded-full w-28 mb-4" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#52B788]/40 flex-shrink-0" />
                            <div className="h-4 bg-[#2D6A4F]/10 rounded-full" style={{ width: `${[60, 45, 70, 50, 55][i]}%` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps card */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                <div className="h-5 bg-[#2D6A4F]/10 rounded-full w-28 mb-4" />
                <div className="space-y-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-7 h-7 rounded-full bg-[#2D6A4F]/15 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-full" />
                                <div className="h-4 bg-[#2D6A4F]/10 rounded-full" style={{ width: `${[80, 65, 75, 55][i]}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SkeletonMyRecipes() {
    return (
        <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="h-5 bg-[#2D6A4F]/10 rounded-full w-52" />
                        <div className="h-6 bg-[#D8F3DC] rounded-full w-16" />
                    </div>
                    <div className="flex gap-4">
                        <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-20" />
                        <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-20" />
                        <div className="h-4 bg-[#2D6A4F]/10 rounded-full w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
