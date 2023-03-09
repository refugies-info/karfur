import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";
import { Picture } from "api-types";

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
    fr: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    ar: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    en: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    ru: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    fa: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    ti: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    ps: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    uk: {
      text: String,
      subtitle: String,
      updatedAt: Date
    },
    image: {
      secure_url: String,
      public_id: String,
      imgId: String
    },
    adminComments: {
      type: String,
      required: false
    },
    nbVues: {
      type: Number,
      required: false,
    },
    position: {
      type: Number,
      required: false,
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface NeedTranslation {
  text: string;
  subtitle: string;
  updatedAt: Moment;
}
export interface NeedDoc extends mongoose.Document {
  tagName?: string;
  theme: ObjectId;
  fr: NeedTranslation;
  ar?: NeedTranslation;
  en?: NeedTranslation;
  ps?: NeedTranslation;
  ti?: NeedTranslation;
  fa?: NeedTranslation;
  ru?: NeedTranslation;
  uk?: NeedTranslation;
  image?: Picture | null;
  adminComments?: string;
  nbVues?: number;
  position?: number;

  createdAt: Moment;
  _id: ObjectId;
}

export const Need = mongoose.model<NeedDoc>("Needs", needsSchema);
