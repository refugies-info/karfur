import { Schema, model, Document } from "mongoose";

export interface AppUserType extends Document {
  uid: string; // Unique uuid v4 generated by the app
  city?: string;
  department?: string;
  selectedLanguage?: string;
  age?: string;
  frenchLevel?: string;
  expoPushToken?: string;
}

const AppUserSchema = new Schema(
  {
    uid: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false
    },
    selectedLanguage: {
      type: String,
      required: false
    },
    age: {
      type: String,
      required: false
    },
    frenchLevel: {
      type: String,
      required: false
    },
    expoPushToken: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const AppUser = model<AppUserType>("AppUser", AppUserSchema);
