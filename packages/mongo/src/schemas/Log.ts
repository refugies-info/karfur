import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
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

export type Log = z.infer<typeof LogSchema> & Document<Types.ObjectId>;
/**
 * LogId represents a unique identifier for a Log.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Log` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type LogId = Types.ObjectId | string;

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

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const LogModel = (models.Log || model("Log", LogMongooseSchema)) as Model<Log>;
