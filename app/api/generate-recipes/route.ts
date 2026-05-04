import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";
import { buildRecipePrompt } from "@/lib/buildRecipePrompt";
import User from "@/models/User";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ingredients, prefs } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 }
      );
    }
    // Rate limiting — max 10 generations per day
    const today = new Date().toISOString().split("T")[0]; // "2025-01-15"

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (user.lastGenerationDate === today && user.dailyGenerations >= 10) {
      return NextResponse.json(
        { error: "Daily limit reached. You can generate up to 10 recipes per day." },
        { status: 429 }
      );
    }

    // Reset count if it's a new day
    if (user.lastGenerationDate !== today) {
      user.dailyGenerations = 0;
      user.lastGenerationDate = today;
    }

    // Increment count
    user.dailyGenerations += 1;
    await user.save();

    const prompt = buildRecipePrompt(ingredients, prefs);

    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content || "";

    // Strip code fences just in case
    const clean = text.replace(/```json|```/g, "").trim();
    const recipes = JSON.parse(clean);

    await connectDB();
    const saved = await Recipe.insertMany(
      recipes.map((r: any) => ({
        ...r,
        userId: session.user.email,
        isSaved: false,
        createdAt: new Date(),
      }))
    );

    return NextResponse.json({ recipes: saved });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipes" },
      { status: 500 }
    );
  }
}