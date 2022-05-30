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
    typeContenu: {
      type: [String],
      enum: ["dispositif", "demarche"],
      required: true,
    },
    location: {
      city: {
        type: String,
      },
      department: {
        type: String,
      }
    },
    languages: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Langue" }]
    },
    author: {
      type: { type: mongoose.Types.ObjectId, ref: "User" },
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface WidgetDoc extends mongoose.Document {
  _id: ObjectId;
  name: string;
  tags: string[];
  typeContenu: "dispositif"|"demarche"[];
  location: {
    city: string;
    department: string;
  }
  languages: ObjectId[];
  author: ObjectId;
  created_at: Moment;
}

export const Widget = mongoose.model<WidgetDoc>("Widgets", widgetSchema);
