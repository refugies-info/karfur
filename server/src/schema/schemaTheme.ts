import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      unique: true,
    },
    short: {
      type: Object,
      required: true,
      unique: true,
    },
    colors: {
      color100: {
        type: String,
        required: true,
      },
      color80: {
        type: String,
        required: true,
      },
      color60: {
        type: String,
        required: true,
      },
      color40: {
        type: String,
        required: true,
      },
      color30: {
        type: String,
        required: true,
      }
    },
    position: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    appImage: {
      type: String,
      required: true,
    },
    shareImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface ThemeDoc extends mongoose.Document {
  _id: ObjectId;
  name: {
    fr: string;
    [key: string]: string;
  };
  short: {
    fr: string;
    [key: string]: string;
  };
  colors: {
    color100: string;
    color80: string;
    color60: string;
    color40: string;
    color30: string;
  }
  position: number;
  icon: Object;
  banner: Object;
  appImage: Object;
  shareImage: Object;
  created_at: Moment;
}


export const Theme = mongoose.model<ThemeDoc>("themes", themeSchema);
