import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// GET — fetch current week's meal plan
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let plan = await MealPlan.findOne({ userId: session.user.email });

        // If no plan exists, create an empty one
        if (!plan) {
            plan = await MealPlan.create({
                userId: session.user.email,
                weekStart: new Date().toISOString(),
                days: DAYS.map((day) => ({ day, recipeId: null, recipeName: null })),
            });
        }

        return NextResponse.json({ plan });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch meal plan" },
            { status: 500 }
        );
    }
}

// PUT — update a single day in the meal plan
export async function PUT(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { day, recipeId, recipeName } = await req.json();

        await connectDB();

        const plan = await MealPlan.findOneAndUpdate(
            {
                userId: session.user.email,
                "days.day": day,
            },
            {
                $set: {
                    "days.$.recipeId": recipeId,
                    "days.$.recipeName": recipeName,
                },
            },
            { new: true }
        );

        return NextResponse.json({ plan });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update meal plan" },
            { status: 500 }
        );
    }
}