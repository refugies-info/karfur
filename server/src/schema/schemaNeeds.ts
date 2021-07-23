import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

var needsSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
    },
    fr: { type: Object, required: true },
    ar: { type: Object, unique: false, required: false },
    en: { type: Object, unique: false, required: false },
    ru: { type: Object, unique: false, required: false },
    fa: { type: Object, unique: false, required: false },
    "ti-ER": { type: Object, unique: false, required: false },
    ps: { type: Object, unique: false, required: false },
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
