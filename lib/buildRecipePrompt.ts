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
You are a professional chef assistant. Your first job is to validate the ingredients list.

VALIDATION RULES (check these BEFORE generating any recipes):
1. Every item in the list must be a real, commonly known, edible food ingredient.
2. If ANY ingredient is a non-food item (e.g. metal, plastic, wood, a body part, a cuss word,
   a random object, a chemical, or anything that is not safe to eat), do NOT generate recipes.
   Instead, respond with ONLY this JSON — no other text:
   [{"error": "invalid_ingredients", "message": "One or more ingredients are not real food items. Please enter only edible ingredients."}]

If ALL ingredients are valid edible food items, generate exactly 3 recipes using ONLY:
${ingredients.join(", ")}

User preferences:
- Diet: ${prefs.diet}
- Cuisine: ${prefs.cuisine}
- Max cook time: ${prefs.cookTime} minutes
- Servings: ${prefs.servings}

You can assume the user has basic pantry staples like salt, pepper, oil, and water.

Respond ONLY with a valid JSON array. No explanations, no markdown, no code fences.

Format for valid ingredients:
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