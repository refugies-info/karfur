import mongoose, { ObjectId } from "mongoose";

var traductionSchema = new mongoose.Schema(
  {
    langueCible: {
      type: String,
      unique: false,
      required: true,
    },
    translatedText: {
      type: Object,
      unique: false,
      required: true,
    },
    initialText: {
      type: Object,
      unique: false,
      required: false,
    },
    initialTranslatedText: {
      type: Object,
      unique: false,
      required: false,
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    validatorId: { type: mongoose.Types.ObjectId, ref: "User" },
    articleId: {
      type: mongoose.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    status: {
      type: String,
      unique: false,
      required: false,
    },
    path: {
      type: Object,
      unique: false,
      required: false,
    },
    rightId: {
      type: String,
      unique: false,
      required: false,
    },
    timeSpent: {
      type: Number,
      unique: false,
      required: false,
    },
    nbMots: {
      type: Number,
      unique: false,
      required: false,
    },
    jsonId: {
      type: String,
      unique: false,
      required: false,
    },
    avancement: {
      type: Number,
      unique: false,
      required: false,
    },
    type: {
      type: String,
      unique: false,
      required: false,
    },
    title: {
      type: String,
      unique: false,
      required: false,
    },
    score: {
      type: Number,
      unique: false,
      required: false,
    },
    isExpert: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface TraductionDoc extends mongoose.Document {
  langueCible: string;
  translatedText: Object;
  initialText: Object;
  initialTranslatedText: Object;
  userId: ObjectId;
  validatorId: ObjectId;
  articleId: ObjectId;
  status: string;
  path: Object;
  rightId: string;
  timeSpent: number;
  nbMots: number;
  jsonId: string;
  avancement: number;
  type: string;
  title: string;
  score: number;
  isExpert: boolean;
  created_at: number;
  updatedAt: number;
  _id: ObjectId;
}

// @ts-ignore
traductionSchema.options.autoIndex = false;

export const Traduction = mongoose.model<TraductionDoc>(
  "Traduction",
  traductionSchema
);
