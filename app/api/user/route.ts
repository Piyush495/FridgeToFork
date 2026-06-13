import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {DAILY_GENERATION_LIMIT} from "@/lib/constants"

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        const today = new Date().toISOString().split("T")[0];

        if(!user) {
            return NextResponse.json(
                {error:"User not found"},
                {status:404}
            )
        }

        const generationsLeft =
            user.lastGenerationDate === today
                ? Math.max(0, DAILY_GENERATION_LIMIT - user.dailyGenerations)
                : DAILY_GENERATION_LIMIT;

        return NextResponse.json({ generationsLeft });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch generations" },
            { status: 500 }
        );
    }
}