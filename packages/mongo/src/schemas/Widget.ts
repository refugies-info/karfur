import { ContentType } from "@refugies-info/api-types";
import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import type { ThemeId } from "./Theme";
import type { UserId } from "./User";

export const WidgetSchema = z.object({
  created_at: z.date().optional(),
  name: z.string(),
  tags: z.array(z.string()),
  themes: z.array(z.custom<ThemeId>()),
  typeContenu: z.array(z.nativeEnum(ContentType)),
  department: z.string().optional(),
  languages: z.array(z.string()).optional(),
  author: z.custom<UserId>(),
  updatedAt: z.date().optional(),
});

export type WidgetType = z.infer<typeof WidgetSchema> & { _id: Types.ObjectId };
export type WidgetId = Types.ObjectId | string;

export interface Widget extends Omit<WidgetType, "themes" | "author"> {
  themes: ThemeId[];
  author: UserId;
}

export const WidgetMongooseSchema = new Schema<Widget>(
  {
    name: { type: String, required: true },
    tags: { type: [String], required: true },
    themes: { type: [{ type: Schema.Types.ObjectId, ref: "Theme" }], required: true },
    typeContenu: { type: [String], enum: Object.values(ContentType), required: true },
    department: { type: String },
    languages: { type: [String] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    collection: "widgets",
    timestamps: { createdAt: "created_at" },
  },
);

export const WidgetModel = model<Widget>("Widget", WidgetMongooseSchema);
