import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        const today = new Date().toISOString().split("T")[0];

        const generationsLeft =
            user.lastGenerationDate === today
                ? Math.max(0, 10 - user.dailyGenerations)
                : 10;

        return NextResponse.json({ generationsLeft });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch generations" },
            { status: 500 }
        );
    }
}