import { StructureStatus } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";
import { ImageZodSchema } from "./generics";

// --- Zod Schemas ---

export const MembreZodSchema = z.object({
  userId: zId("User"),
  added_at: z.date(),
});

export type Membre = z.infer<typeof MembreZodSchema>;

export const DetailedOpeningHoursZodSchema = z.object({
  day: z.string(),
  from0: z.string().optional(),
  to0: z.string().optional(),
  from1: z.string().optional(),
  to1: z.string().optional(),
});

export const OpeningHoursZodSchema = z.object({
  details: z.array(DetailedOpeningHoursZodSchema),
  noPublic: z.boolean().optional(),
  precisions: z.string().optional(),
});

export const StructureZodSchema = z.object({
  membres: z.array(MembreZodSchema).optional(),
  acronyme: z.string().optional(),
  administrateur: zId("User").optional(),
  adresse: z.string().optional(),
  authorBelongs: z.boolean().optional(),
  contact: z.string().optional(),
  createur: zId("User"),
  link: z.string().optional(),
  mail_contact: z.string().optional(),
  mail_generique: z.string().optional(),
  nom: z.string(),
  phone_contact: z.string().optional(),
  siren: z.string().optional(),
  siret: z.string().optional(),
  status: z.enum(Object.values(StructureStatus) as [string, ...string[]]).optional() as z.ZodType<
    StructureStatus | undefined
  >,
  picture: ImageZodSchema.optional(),
  structureTypes: z.array(z.string()).optional(),
  websites: z.array(z.string()).optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  activities: z.array(z.string()).optional(),
  departments: z.array(z.string()).optional(),
  phonesPublic: z.array(z.string()).optional(),
  mailsPublic: z.array(z.string()).optional(),
  adressPublic: z.string().optional(),
  openingHours: OpeningHoursZodSchema.optional(),
  onlyWithRdv: z.boolean().optional(),
  description: z.string().optional(),
  hasResponsibleSeenNotification: z.boolean().optional(),
  disposAssociesLocalisation: z.array(z.string()).optional(),
  adminComments: z.string().optional(),
  adminProgressionStatus: z.string().optional(),
  adminPercentageProgressionStatus: z.string().optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Structure = z.infer<typeof StructureZodSchema> & Document<Types.ObjectId>;

/**
 * StructureId represents a unique identifier for a Structure.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Structure` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type StructureId = Structure["_id"] | string;

// --- Schemas ---

const StructureMongooseSchema = zodSchema(StructureZodSchema);
StructureMongooseSchema.set("collection", "structures");
StructureMongooseSchema.set("timestamps", { createdAt: "created_at" });

// Disable _id for subdocuments
const picturePath = StructureMongooseSchema.path("picture") as any;
if (picturePath && picturePath.schema) picturePath.schema.set("_id", false);

const membresPath = StructureMongooseSchema.path("membres") as any;
if (membresPath && membresPath.schema) membresPath.schema.set("_id", false);

const openingHoursPath = StructureMongooseSchema.path("openingHours") as any;
if (openingHoursPath && openingHoursPath.schema) {
  openingHoursPath.schema.set("_id", false);
  const detailsPath = openingHoursPath.schema.path("details") as any;
  if (detailsPath && detailsPath.schema) detailsPath.schema.set("_id", false);
}

export const StructureModel = model("Structure", StructureMongooseSchema);
