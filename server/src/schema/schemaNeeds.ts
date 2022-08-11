import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

var needsSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: false,
    },
    theme: {
      type: mongoose.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    fr: { text: String, updatedAt: Date },
    ar: { text: String, updatedAt: Date },
    en: { text: String, updatedAt: Date },
    ru: { text: String, updatedAt: Date },
    fa: { text: String, updatedAt: Date },
    ti: { text: String, updatedAt: Date },
    ps: { text: String, updatedAt: Date },
    uk: { text: String, updatedAt: Date },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface NeedTranslation {
  text: string;
  updatedAt: Moment;
}
export interface NeedDoc extends mongoose.Document {
  tagName: string;
  theme: ObjectId;
  fr: NeedTranslation;
  ar?: NeedTranslation;
  en?: NeedTranslation;
  ps?: NeedTranslation;
  ti?: NeedTranslation;
  fa?: NeedTranslation;
  ru?: NeedTranslation;
  uk?: NeedTranslation;

  createdAt: Moment;
  _id: ObjectId;
}

export const Need = mongoose.model<NeedDoc>("Needs", needsSchema);
