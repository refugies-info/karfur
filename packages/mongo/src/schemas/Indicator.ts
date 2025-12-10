import type { Languages } from "@refugies-info/api-types";
import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import type { UserId } from "./User";

// Indicator Schema
export const IndicatorSchema = z.object({
  language: z.string() as z.ZodType<Languages>,
  wordsCount: z.number().int().positive(),
  dispositifId: z.custom<Types.ObjectId>(),
  userId: z.custom<UserId>(),
  timeSpent: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type IndicatorType = z.infer<typeof IndicatorSchema> & { _id: Types.ObjectId };
export type IndicatorId = Types.ObjectId | string;

export interface Indicator extends Omit<IndicatorType, "userId" | "dispositifId"> {
  userId: UserId;
  dispositifId: Types.ObjectId;
}

export const IndicatorMongooseSchema = new Schema<Indicator>(
  {
    language: { type: String, required: true },
    wordsCount: {
      type: Number,
      required: true,
      validate: (value: unknown) => Number.isInteger(value) && Number(value) > 0,
    },
    dispositifId: { type: Schema.Types.ObjectId, ref: "Dispositif", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timeSpent: {
      type: Number,
      required: true,
      validate: (v: unknown) => Number.isInteger(v) && Number(v) > 0,
    },
  },
  {
    collection: "indicators",
    timestamps: true,
  },
);

export const IndicatorModel = model<Indicator>("Indicator", IndicatorMongooseSchema);
