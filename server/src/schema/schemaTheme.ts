import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";
import { Picture } from "../types/interface";

const imageSchema = {
  secure_url: String,
  public_id: String,
  imgId: String,
};

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
    icon: imageSchema,
    banner: imageSchema,
    appBanner: imageSchema,
    appImage: imageSchema,
    shareImage: imageSchema,
    notificationEmoji: {
      type: String,
      required: true,
    },
    adminComments: {
      type: String,
      required: false
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
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  notificationEmoji: string;
  adminComments?: string;
  created_at: Moment;
}


export const Theme = mongoose.model<ThemeDoc>("Theme", themeSchema);
