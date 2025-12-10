import { ContentType } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { model, type Schema, type Types } from "mongoose";
import { z } from "zod";
import type { ThemeId } from "./Theme";
import type { UserId } from "./User";

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

export type WidgetType = z.infer<typeof WidgetSchema> & { _id: Types.ObjectId };
export type WidgetId = Types.ObjectId | string;

export interface Widget extends Omit<WidgetType, "themes" | "author"> {
  themes: ThemeId[];
  author: UserId;
}

export const WidgetMongooseSchema = zodSchema(WidgetSchema);
WidgetMongooseSchema.set("collection", "widgets");
WidgetMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const WidgetModel = model<Widget>(
  "Widget",
  WidgetMongooseSchema as unknown as Schema<Widget>,
);
