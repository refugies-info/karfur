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
      enum: ["dispositifs", "demarches"],
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
      type: [String]
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
  typeContenu: ("dispositifs"|"demarches")[];
  location: {
    city: string;
    department: string;
  }
  languages: string[];
  author: ObjectId;
  created_at: Moment;
}

export const Widget = mongoose.model<WidgetDoc>("Widgets", widgetSchema);
