interface Preferences {
    diet: string;
    cuisine: string;
    cookTime: string;
    servings: string;
}

export function buildRecipePrompt(
    ingredients: string[],
    prefs: Preferences
): string {
    return `
You are a professional chef assistant.
Generate exactly 3 recipes using ONLY these ingredients: ${ingredients.join(", ")}.

User preferences:
- Diet: ${prefs.diet}
- Cuisine: ${prefs.cuisine}
- Max cook time: ${prefs.cookTime} minutes
- Servings: ${prefs.servings}

You can assume the user has basic pantry staples like salt, pepper, oil, and water.

Respond ONLY with a valid JSON array. No explanations, no markdown, no code fences.

Format:
[
  {
    "name": "Recipe Name",
    "ingredients": [
      { "item": "onion", "amount": "2", "unit": "medium" }
    ],
    "steps": ["Step 1...", "Step 2...", "Step 3..."],
    "cookTime": 25,
    "servings": 2,
    "cuisineType": "Indian",
    "macros": { "protein": 18, "carbs": 42, "fat": 12 }
  }
]
  `;
}