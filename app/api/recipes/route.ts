import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const recipes = await Recipe.find({
            userId: session.user.email,
            isSaved: true,
        }).sort({ createdAt: -1 });

        return NextResponse.json({ recipes });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch recipes" },
            { status: 500 }
        );
    }
}