import { RoleName } from "@refugies-info/api-types";
import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

export const RoleZodSchema = z.object({
  nom: z.nativeEnum(RoleName),
  nomPublique: z.string().optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RoleType = z.infer<typeof RoleZodSchema>;

export type Role = z.infer<typeof RoleZodSchema> & Document;

export type RoleId = Role["_id"] | Role["id"];

export const RoleMongooseSchema = zodSchema(RoleZodSchema);
RoleMongooseSchema.path("nom").unique(true);
RoleMongooseSchema.set("collection", "roles");
RoleMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const RoleModel = model("Role", RoleMongooseSchema);
