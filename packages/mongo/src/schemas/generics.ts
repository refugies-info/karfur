import { Schema } from "mongoose";
import { z } from "zod";

// Image Schema
export const ImageZodSchema = z.object({
  secure_url: z.string(),
  public_id: z.string().nullable(),
  imgId: z.string().nullable(),
});

export type ImageType = z.infer<typeof ImageZodSchema>;

export interface Image extends ImageType {}

export const ImageSchema = new Schema<Image>(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String },
    imgId: { type: String },
  },
  { _id: false },
);
