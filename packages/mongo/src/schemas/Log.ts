import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
// import type { DispositifId } from "./Dispositif"; // Not yet available
import type { LangueId } from "./Langue";
import type { StructureId } from "./Structure";
import type { UserId } from "./User";

export const LogLinkSchema = z.object({
  id: z.custom<Types.ObjectId>(),
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
  objectId: z.custom<Types.ObjectId>(),
  model_object: z.enum(["User", "Dispositif", "Structure"]),
  text: z.string(),
  author: z.custom<UserId>().optional(),
  dynamicId: z.custom<Types.ObjectId>().optional(),
  model_dynamic: z.enum(["User", "Dispositif", "Structure", "Langue"]).optional(),
  link: LogLinkSchema.optional(),
  updatedAt: z.date().optional(),
});

export type LogType = z.infer<typeof LogSchema> & { _id: Types.ObjectId };
export type LogId = Types.ObjectId | string;

export interface Log extends Omit<LogType, "objectId" | "author" | "dynamicId" | "link"> {
  objectId: Types.ObjectId;
  author?: UserId;
  dynamicId?: Types.ObjectId;
  link?: LogLink;
}

const LogLinkMongooseSchema = new Schema<LogLink>(
  {
    id: { type: Schema.Types.ObjectId, refPath: "model_link" },
    model_link: { type: String, enum: ["User", "Dispositif", "Structure"] },
    next: { type: String },
  },
  { _id: false },
);

export const LogMongooseSchema = new Schema<Log>(
  {
    objectId: { type: Schema.Types.ObjectId, required: true, refPath: "model_object" },
    model_object: { type: String, required: true, enum: ["User", "Dispositif", "Structure"] },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    dynamicId: { type: Schema.Types.ObjectId, refPath: "model_dynamic" },
    model_dynamic: {
      type: String,
      enum: ["User", "Dispositif", "Structure", "Langue"],
      required: function () {
        return !!this.dynamicId;
      },
    },
    link: { type: LogLinkMongooseSchema },
  },
  {
    collection: "logs",
    timestamps: { createdAt: "created_at" },
  },
);

export const LogModel = model<Log>("Log", LogMongooseSchema);
