import { type Document, Schema, Types } from "mongoose";
import { z } from "zod";

export class ObjectId extends Types.ObjectId {}

export type Ref<T> = T | Types.ObjectId | string;
export type DocumentType<T> = T & Document;

export function isDocument(doc: any): doc is Document {
  return doc instanceof Types.ObjectId === false && doc?._id;
}

export function isDocumentArray(docs: any[] | undefined): docs is Document[] {
  return Array.isArray(docs) && docs.length > 0 && isDocument(docs[0]);
}

// Image Schema
// Image Schema
export const ImageZodSchema = z.object({
  secure_url: z.string(),
  public_id: z.string(),
  imgId: z.string(),
});

export type ImageType = z.infer<typeof ImageZodSchema>;

export interface Image extends ImageType {}

import { zodSchema } from "@zodyac/zod-mongoose";

export const ImageSchema = zodSchema(ImageZodSchema);
ImageSchema.set("_id", false);
