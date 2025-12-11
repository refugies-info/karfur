import { ContentType } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

export const WidgetSchema = z.object({
  created_at: z.date().optional(),
  name: z.string(),
  tags: z.array(z.string()),
  themes: z.array(zId("Theme")),
  typeContenu: z.array(
    z.enum(Object.values(ContentType) as [string, ...string[]]) as z.ZodType<ContentType>,
  ),
  department: z.string().optional(),
  languages: z.array(z.string()).optional(),
  author: zId("User"),
  updatedAt: z.date().optional(),
});

export type Widget = z.infer<typeof WidgetSchema> & Document<Types.ObjectId>;
/**
 * WidgetId represents a unique identifier for a Widget.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Widget` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type WidgetId = Types.ObjectId | string;

export const WidgetMongooseSchema = zodSchema(WidgetSchema);
WidgetMongooseSchema.set("collection", "widgets");
WidgetMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const WidgetModel = model("Widget", WidgetMongooseSchema);
