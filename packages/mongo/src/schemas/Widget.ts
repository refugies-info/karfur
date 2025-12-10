import { ContentType } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { model, type Types } from "mongoose";
import { z } from "zod";

export const WidgetSchema = z.object({
  created_at: z.date().optional(),
  name: z.string(),
  tags: z.array(z.string()),
  themes: z.array(zId("Theme")),
  typeContenu: z.array(z.nativeEnum(ContentType)),
  department: z.string().optional(),
  languages: z.array(z.string()).optional(),
  author: zId("User"),
  updatedAt: z.date().optional(),
});

export type Widget = z.infer<typeof WidgetSchema> & Document;
export type WidgetId = Types.ObjectId;

export const WidgetMongooseSchema = zodSchema(WidgetSchema);
WidgetMongooseSchema.set("collection", "widgets");
WidgetMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const WidgetModel = model("Widget", WidgetMongooseSchema);
