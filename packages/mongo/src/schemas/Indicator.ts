import type { Languages } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { z } from "zod";
import type { UserId } from "./User";

// Indicator Schema
export const IndicatorSchema = z.object({
  language: z.string() as z.ZodType<Languages>,
  wordsCount: z.number().int().positive(),
  dispositifId: zId("Dispositif"),
  userId: zId("User"),
  timeSpent: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type IndicatorType = z.infer<typeof IndicatorSchema>;
export type IndicatorId = Types.ObjectId;

export interface Indicator extends Omit<IndicatorType, "userId" | "dispositifId">, Document {
  userId: UserId;
  dispositifId: Types.ObjectId;
}

export const IndicatorMongooseSchema = zodSchema(IndicatorSchema);
IndicatorMongooseSchema.set("collection", "indicators");
IndicatorMongooseSchema.set("timestamps", true);

export const IndicatorModel = model<Indicator>(
  "Indicator",
  IndicatorMongooseSchema as unknown as Schema<Indicator>,
);
