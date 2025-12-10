import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

import type { UserId } from "./User";

export const LogLinkSchema = z.object({
  id: zId(),
  model_link: z.enum(["User", "Dispositif", "Structure"]),
  next: z.enum([
    "ModalContenu",
    "ModalStructure",
    "ModalUser",
    "ModalReaction",
    "ModalImprovements",
    "ModalNeeds",
    "PageAnnuaire",
  ]),
});

export type LogLink = z.infer<typeof LogLinkSchema>;

export const LogSchema = z.object({
  created_at: z.date().optional(),
  objectId: zId(),
  model_object: z.enum(["User", "Dispositif", "Structure"]),
  text: z.string(),
  author: zId("User").optional(),
  dynamicId: zId().optional(),
  model_dynamic: z.enum(["User", "Dispositif", "Structure", "Langue"]).optional(),
  link: LogLinkSchema.optional(),
  updatedAt: z.date().optional(),
});

export type Log = z.infer<typeof LogSchema> & Document;
export type LogId = Types.ObjectId;

const LogMongooseSchema = zodSchema(LogSchema);
LogMongooseSchema.set("collection", "logs");
LogMongooseSchema.set("timestamps", { createdAt: "created_at" });

// Configure dynamic refs
LogMongooseSchema.path("objectId").options.refPath = "model_object";

const dynamicIdPath = LogMongooseSchema.path("dynamicId");
if (dynamicIdPath) {
  dynamicIdPath.options.refPath = "model_dynamic";
}

const modelDynamicPath = LogMongooseSchema.path("model_dynamic");
if (modelDynamicPath) {
  modelDynamicPath.required(function (this: Log) {
    return !!this.dynamicId;
  } as any);
}

// Configure link subdocument
const linkPath = LogMongooseSchema.path("link") as any;
if (linkPath && linkPath.schema) {
  linkPath.schema.set("_id", false);
  const linkIdPath = linkPath.schema.path("id");
  if (linkIdPath) {
    linkIdPath.options.refPath = "model_link";
  }
}

export const LogModel = model("Log", LogMongooseSchema);
