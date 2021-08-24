import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

var needsSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
    },
    fr: { text: String, updatedAt: Date },
    ar: { text: String, updatedAt: Date },
    en: { text: String, updatedAt: Date },
    ru: { text: String, updatedAt: Date },
    fa: { text: String, updatedAt: Date },
    "ti-ER": { text: String, updatedAt: Date },
    ps: { text: String, updatedAt: Date },
  },
  // @ts-ignore : https://github.com/Automattic/mongoose/issues/9606
  { timestamps: { createdAt: "created_at" } }
);

export interface NeedTranslation {
  text: string;
  updatedAt: Moment;
}
export interface NeedDoc extends mongoose.Document {
  tagName: string;
  fr: NeedTranslation;
  ar?: NeedTranslation;
  en?: NeedTranslation;
  ps?: NeedTranslation;
  "ti-ER"?: NeedTranslation;
  fa?: NeedTranslation;
  ru?: NeedTranslation;

  createdAt: Moment;
  _id: ObjectId;
}

export const Need = mongoose.model<NeedDoc>("Needs", needsSchema);
