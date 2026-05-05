import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const recipe = await Recipe.findByIdAndUpdate(
            params.id,
            { isSaved: true },
            { new: true }
        );

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json({ recipe });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to save recipe" },
            { status: 500 }
        );
    }
}