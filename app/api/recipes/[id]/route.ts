import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const recipe = await Recipe.findById(params.id);

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json({ recipe });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch recipe" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const recipe = await Recipe.findOneAndDelete({
            _id: params.id,
            userId: session.user.email,
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Recipe deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete recipe" },
            { status: 500 }
        );
    }
}