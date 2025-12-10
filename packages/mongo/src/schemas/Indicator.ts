import type { Languages } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

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

export type Indicator = z.infer<typeof IndicatorSchema> & Document;
export type IndicatorId = Types.ObjectId;

export const IndicatorMongooseSchema = zodSchema(IndicatorSchema);
IndicatorMongooseSchema.set("collection", "indicators");
IndicatorMongooseSchema.set("timestamps", true);

export const IndicatorModel = model("Indicator", IndicatorMongooseSchema);
