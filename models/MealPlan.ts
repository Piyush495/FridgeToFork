import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
    userId: string;
    weekStart: string;
    days: {
        day: string;
        recipeId: string | null;
        recipeName: string | null;
    }[];
    createdAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>({
    userId: { type: String, required: true },
    weekStart: { type: String, required: true },
    days: [
        {
            day: String,
            recipeId: { type: String, default: null },
            recipeName: { type: String, default: null },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MealPlan ||
    mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);