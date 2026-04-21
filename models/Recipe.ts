import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  userId: string;
  name: string;
  ingredients: { item: string; amount: string; unit: string }[];
  steps: string[];
  cookTime: number;
  servings: number;
  cuisineType: string;
  macros: { protein: number; carbs: number; fat: number };
  isSaved: boolean;
  createdAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  ingredients: [
    {
      item: String,
      amount: String,
      unit: String,
    },
  ],
  steps: [{ type: String }],
  cookTime: { type: Number },
  servings: { type: Number },
  cuisineType: { type: String },
  macros: {
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  isSaved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recipe ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
