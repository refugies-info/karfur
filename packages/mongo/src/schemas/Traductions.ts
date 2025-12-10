import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { z } from "zod";
import type { UserId } from "./User";

export enum TraductionsType {
  SUGGESTION = "suggestion",
  VALIDATION = "validation",
}

export enum TraductionsStatus {
  VALIDATED = "VALIDATED",
  TO_REVIEW = "TO_REVIEW",
  PENDING = "PENDING",
  TO_TRANSLATE = "TO_TRANSLATE",
}

export const TraductionDiffSchema = z.object({
  added: z.array(z.string()),
  modified: z.array(z.string()),
  removed: z.array(z.string()),
});
export type TraductionDiff = z.infer<typeof TraductionDiffSchema>;

export const TraductionsZodSchema = z.object({
  dispositifId: zId("Dispositif"),
  userId: zId("User"),
  language: z.enum(["fr", "en", "uk", "ti", "ar", "ps", "ru", "fa"]),
  translated: z.record(z.unknown()), // Partial<TranslationContent> is complex, using generic object
  timeSpent: z.number().optional(),
  finished: z.boolean().optional(),
  toReview: z.array(z.string()).optional(),
  toReviewCache: z.array(z.string()).optional(),
  toFinish: z.array(z.string()).optional(),
  type: z.nativeEnum(TraductionsType).optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TraductionsTypeObj = z.infer<typeof TraductionsZodSchema>;
export type TraductionId = Types.ObjectId | string;

export interface Traductions
  extends Omit<TraductionsTypeObj, "dispositifId" | "userId" | "translated">,
    Document {
  dispositifId: Types.ObjectId;
  userId: UserId;
  translated: Record<string, any>;
}

const TraductionsMongooseSchema = zodSchema(TraductionsZodSchema);
TraductionsMongooseSchema.set("collection", "traductions");
TraductionsMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const TraductionsModel = model<Traductions>(
  "Traductions",
  TraductionsMongooseSchema as unknown as Schema<Traductions>,
);
