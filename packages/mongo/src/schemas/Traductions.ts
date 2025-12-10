import { Languages } from "@refugies-info/api-types";
import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import type { UserId } from "./User";
// import type { DispositifId } from "./Dispositif"; // Not yet available
// We'll use Types.ObjectId for DispositifId for now

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

export const TraductionsSchema = z.object({
  dispositifId: z.custom<Types.ObjectId>(),
  userId: z.custom<UserId>(),
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

export type TraductionsTypeObj = z.infer<typeof TraductionsSchema> & { _id: Types.ObjectId };
export type TraductionId = Types.ObjectId | string;

export interface Traductions extends Omit<TraductionsTypeObj, "dispositifId" | "userId"> {
  dispositifId: Types.ObjectId;
  userId: UserId;
}

export const TraductionsMongooseSchema = new Schema<Traductions>(
  {
    dispositifId: { type: Schema.Types.ObjectId, ref: "Dispositif" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    language: { type: String, required: true },
    translated: { type: Object, required: true },
    timeSpent: { type: Number },
    finished: { type: Boolean },
    toReview: { type: [String] },
    toReviewCache: { type: [String] },
    toFinish: { type: [String] },
    type: { type: String, enum: Object.values(TraductionsType) },
  },
  {
    collection: "traductions",
    timestamps: { createdAt: "created_at" },
  },
);

export const TraductionsModel = model<Traductions>("Traductions", TraductionsMongooseSchema);
