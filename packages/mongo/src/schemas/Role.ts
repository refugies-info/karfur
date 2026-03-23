import { RoleName } from "@refugies-info/api-types";
import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { z } from "zod";

export const RoleZodSchema = z.object({
  nom: z.enum(Object.values(RoleName) as [string, ...string[]]) as z.ZodType<RoleName>,
  nomPublique: z.string().optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RoleType = z.infer<typeof RoleZodSchema>;

export type Role = z.infer<typeof RoleZodSchema> & Document<Types.ObjectId>;

/**
 * RoleId represents a unique identifier for a Role.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Role` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type RoleId = Types.ObjectId | string;

export const RoleMongooseSchema = zodSchema(RoleZodSchema);
RoleMongooseSchema.path("nom").unique(true);
RoleMongooseSchema.set("collection", "roles");
RoleMongooseSchema.set("timestamps", { createdAt: "created_at" });

RoleMongooseSchema.plugin(SpeedGooseCacheAutoCleaner);

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const RoleModel = (models.Role || model("Role", RoleMongooseSchema)) as Model<Role>;
