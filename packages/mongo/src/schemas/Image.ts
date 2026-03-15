import { type Model, model, models, Schema, type Types } from "mongoose";
import { z } from "zod";

// CloudinaryImage Schema (for Cloudinary images stored in DB)
export const CloudinaryImageSchema = z.object({
  public_id: z.string(),
  format: z.string(),
  height: z.number(),
  width: z.number(),
  original_filename: z.string(),
  secure_url: z.string(),
  signature: z.string(),
  url: z.string(),
  version: z.string(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CloudinaryImageType = z.infer<typeof CloudinaryImageSchema> & { _id: Types.ObjectId };
export type CloudinaryImageId = Types.ObjectId | string;

export interface CloudinaryImage extends Omit<CloudinaryImageType, "_id"> {
  _id: Types.ObjectId;
}

export const CloudinaryImageMongooseSchema = new Schema<CloudinaryImage>(
  {
    public_id: { type: String, trim: true, unique: true, required: true },
    format: { type: String },
    height: { type: Number },
    width: { type: Number },
    original_filename: { type: String },
    secure_url: { type: String },
    signature: { type: String },
    url: { type: String },
    version: { type: String },
  },
  {
    collection: "images",
    timestamps: { createdAt: "created_at" },
  },
);

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const CloudinaryImageModel = (models.Image ||
  model("Image", CloudinaryImageMongooseSchema)) as Model<CloudinaryImage>;
