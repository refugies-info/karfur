import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

const widgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    themes: {
      type: [{
        type: mongoose.Types.ObjectId,
        ref: "Theme"
      }],
      required: true,
    },
    typeContenu: {
      type: [String],
      enum: ["dispositif", "demarche"],
      required: true,
    },
    department: {
      type: String,
    },
    languages: {
      type: [String] // only 1 allowed for now, but save an array for later
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface WidgetDoc extends mongoose.Document {
  _id: ObjectId;
  name: string;
  tags: string[];
  themes: ObjectId[];
  typeContenu: ("dispositif"|"demarche")[];
  department: string;
  languages: string[];
  author: ObjectId;
  created_at: Moment;
}

export const Widget = mongoose.model<WidgetDoc>("Widgets", widgetSchema);
