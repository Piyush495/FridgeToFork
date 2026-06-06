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
        { error: "No ingredients provided." },
        { status: 400 }
      );
    }

    // Rate limiting — max 10 generations per day
    const today = new Date().toISOString().split("T")[0];

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if(!user) {
      return NextResponse.json(
        {error:"User not found"},
        {status:404}
      )
    }

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

    // ── Let the AI validate ingredients and generate recipes ──
    const prompt = buildRecipePrompt(ingredients, prefs);

    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content || "";

    // Strip code fences just in case
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // If the AI detected non-food / invalid ingredients, return error
    // WITHOUT counting this attempt toward the daily limit.
    if (
      Array.isArray(parsed) &&
      parsed.length === 1 &&
      parsed[0]?.error === "invalid_ingredients"
    ) {
      return NextResponse.json(
        { error: parsed[0].message ?? "One or more ingredients are not valid food items. Please enter only real, edible ingredients." },
        { status: 400 }
      );
    }

    // All good — now increment the daily counter and save recipes
    user.dailyGenerations += 1;
    await user.save();

    const saved = await Recipe.insertMany(
      parsed.map((r: any) => ({
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

