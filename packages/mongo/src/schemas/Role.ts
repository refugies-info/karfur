import { RoleName } from "@refugies-info/api-types";
import { type Document, model, Schema, type Types } from "mongoose";
import { z } from "zod";

export const RoleZodSchema = z.object({
  nom: z.nativeEnum(RoleName),
  nomPublique: z.string().optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RoleType = z.infer<typeof RoleZodSchema>;

export interface Role extends Document {
  _id: Types.ObjectId;
  nom: RoleName;
  nomPublique?: string;
  created_at?: Date;
  updatedAt?: Date;
}

export type RoleId = Role["_id"] | Role["id"];

const RoleSchema = new Schema<Role>(
  {
    nom: {
      type: String,
      enum: Object.values(RoleName),
      required: true,
      unique: true,
    },
    nomPublique: { type: String },
  },
  {
    collection: "roles",
    timestamps: { createdAt: "created_at" },
  },
);

export const RoleModel = model<Role>("Role", RoleSchema);
