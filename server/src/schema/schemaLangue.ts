import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

var langueSchema = new mongoose.Schema(
  {
    langueFr: {
      type: String,
      unique: true,
      required: true,
    },
    langueLoc: {
      type: String,
      unique: false,
      required: false,
    },
    langueCode: {
      type: String,
      unique: false,
      required: false,
    },
    langueIsDialect: {
      type: Boolean,
      unique: false,
      required: false,
    },
    langueBackupId: { type: mongoose.Types.ObjectId, ref: "Langue" },
    status: {
      type: String,
      unique: false,
      required: false,
    },
    i18nCode: {
      type: String,
      unique: true,
      required: true,
    },
    avancement: {
      type: Number,
      unique: false,
      required: false,
    },
    avancementTrad: {
      type: Number,
      unique: false,
      required: false,
    },
    participants: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface LangueDoc extends mongoose.Document {
  langueFr: string;
  langueLoc?: string;
  langueCode?: string;
  langueIsDialect?: Boolean;
  langueBackupId?: ObjectId;
  status?: string;
  i18nCode: string;
  avancement?: number;
  avancementTrad?: number;
  participants?: ObjectId[];
  createdAt: Moment;
  _id: ObjectId;
}

export const Langue = mongoose.model<LangueDoc>("Langue", langueSchema);
