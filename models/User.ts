import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  preferences: {
    diet: string;
    cuisine: string;
    cookTime: number;
    servings: number;
  };
  ingredients: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    diet: { type: String, default: "none" },
    cuisine: { type: String, default: "any" },
    cookTime: { type: Number, default: 30 },
    servings: { type: Number, default: 2 },
  },
  ingredients: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
