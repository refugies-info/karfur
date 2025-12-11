import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";
import { ImageZodSchema } from "./generics";

// --- Nested Types ---
export type InfoSections = Record<string, InfoSection>;

export const SponsorZodSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  link: z.string().optional(),
  _id: z.any().optional(), // Let Mongoose handle _id creation for subdoc if needed, or zId()
});
// Note: Sponsor in original schema didn't enforce _id but Mongoose adds it by default for subdocs in array unless _id: false.
// Original SponsorMongooseSchema didn't set _id: false.

export type Sponsor = z.infer<typeof SponsorZodSchema>;

export const InfoSectionZodSchema = z.object({
  title: z.string(),
  text: z.string(),
  _id: z.any().optional(),
});
export type InfoSection = z.infer<typeof InfoSectionZodSchema>;

export const SuggestionZodSchema = z.object({
  created_at: z.date(),
  userId: zId("User").optional(),
  read: z.boolean(),
  suggestion: z.string(),
  suggestionId: z.string(),
  section: z.string(),
  _id: z.any().optional(),
});
export type Suggestion = z.infer<typeof SuggestionZodSchema>;

export const MerciZodSchema = z.object({
  created_at: z.date(),
  userId: zId("User").optional(),
  _id: z.any().optional(),
});
export type Merci = z.infer<typeof MerciZodSchema>;

export const AvisZodSchema = z.object({
  created_at: z.date(),
  userId: zId("User").optional(),
  anonymousUserId: z.string().optional(),
  avis: z.boolean(),
  language: z.string(),
  _id: z.any().optional(),
});
export type Avis = z.infer<typeof AvisZodSchema>;

export const AgeZodSchema = z.object({
  type: z.string(),
  ages: z.array(z.number()),
});
export type Age = z.infer<typeof AgeZodSchema>;

export const PriceZodSchema = z.object({
  values: z.array(z.number()),
  details: z.string().optional(),
});
export type Price = z.infer<typeof PriceZodSchema>;

export const CommitmentZodSchema = z.object({
  amountDetails: z.string(),
  hours: z.array(z.number()),
  timeUnit: z.string(),
});
export type Commitment = z.infer<typeof CommitmentZodSchema>;

export const FrequencyZodSchema = z.object({
  amountDetails: z.string(),
  hours: z.number(),
  timeUnit: z.string(),
  frequencyUnit: z.string(),
});
export type Frequency = z.infer<typeof FrequencyZodSchema>;

export const MetadatasZodSchema = z.object({
  location: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  frenchLevel: z.array(z.string()).optional().nullable(),
  age: AgeZodSchema.optional().nullable(),
  price: PriceZodSchema.optional().nullable(),
  publicStatus: z.array(z.string()).optional().nullable(),
  public: z.array(z.string()).optional().nullable(),
  conditions: z.array(z.string()).optional().nullable(),
  commitment: CommitmentZodSchema.optional().nullable(),
  frequency: FrequencyZodSchema.optional().nullable(),
  timeSlots: z.array(z.string()).optional().nullable(),
});
export type Metadatas = z.infer<typeof MetadatasZodSchema>;

export const PoiZodSchema = z.object({
  title: z.string(),
  address: z.string(),
  city: z.string().optional().nullable(),
  lat: z.number(),
  lng: z.number(),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  _id: z.any().optional(),
});
export type Poi = z.infer<typeof PoiZodSchema>;

// --- Content Types ---

export const DispositifContentZodSchema = z.object({
  titreInformatif: z.string(),
  titreMarque: z.string(),
  abstract: z.string(),
  what: z.string(),
  why: z.record(InfoSectionZodSchema),
  how: z.record(InfoSectionZodSchema),
});
export type DispositifContent = z.infer<typeof DispositifContentZodSchema>;

export const DemarcheContentZodSchema = z.object({
  titreInformatif: z.string(),
  titreMarque: z.string(),
  abstract: z.string(),
  what: z.string(),
  how: z.record(InfoSectionZodSchema),
  next: z.record(InfoSectionZodSchema),
  administrationName: z.string().nullable(),
});
export type DemarcheContent = z.infer<typeof DemarcheContentZodSchema>;

export const TranslationContentZodSchema = z.object({
  content: z.union([DispositifContentZodSchema, DemarcheContentZodSchema]),
  created_at: z.date(),
  validatorId: zId("User"), // Assuming Validator is User
});

export type TranslationContent = {
  content: DispositifContent | DemarcheContent;
  created_at: Date;
  validatorId: Types.ObjectId;
};

// --- Main Dispositif Schema ---

export const DispositifZodSchema = z.object({
  typeContenu: z.enum(
    Object.values(ContentType) as [string, ...string[]],
  ) as z.ZodType<ContentType>,
  status: z.enum(
    Object.values(DispositifStatus) as [string, ...string[]],
  ) as z.ZodType<DispositifStatus>,
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
  origin: z
    .enum(Object.values(DispositifOrigin) as [string, ...string[]])
    .default(DispositifOrigin.RI) as z.ZodType<DispositifOrigin>,

  mainSponsor: zId("Structure").optional(),
  theme: zId("Theme").optional(),
  secondaryThemes: z.array(zId("Theme")).optional(),
  needs: z.array(zId("Need")).optional(),
  sponsors: z.array(z.union([zId("Structure"), SponsorZodSchema])).optional(),
  externalLink: z.string().optional(),

  creatorId: zId("User"),
  participants: z.array(zId("User")).optional(),

  lastAdminUpdate: z.date().optional(),
  lastModificationAuthor: zId("User"),
  lastModificationDate: z.date().optional(),
  publishedAt: z.date().optional(),
  publishedAtAuthor: zId("User").optional(),
  deletionDate: z.date().optional(),

  nbFavoritesMobile: z.number().default(0),
  nbFavorites: z.number().default(0),
  nbVues: z.number().default(0),
  nbVuesMobile: z.number().default(0),
  nbMots: z.number().default(0),

  adminComments: z.string().optional(),
  adminProgressionStatus: z.string().optional(),
  hasDraftVersion: z.boolean().optional(),

  draftReminderMailSentDate: z.date().optional(),
  draftSecondReminderMailSentDate: z.date().optional(),
  lastReminderMailSentToUpdateContentDate: z.date().optional(),

  themesSelectedByAuthor: z.boolean().optional(),
  notificationsSent: z.record(z.boolean()).optional(),

  suggestions: z.array(SuggestionZodSchema).optional(),
  merci: z.array(MerciZodSchema).optional(),
  avis: z.array(AvisZodSchema).optional(),
  webOnly: z.boolean().optional(),

  translations: z.any().optional(),
  metadatas: MetadatasZodSchema.optional(),
  map: z.array(PoiZodSchema).nullable().optional(),
  administrationLogo: ImageZodSchema.nullable().optional(),
});

export type Dispositif = z.infer<typeof DispositifZodSchema> & Document<Types.ObjectId>;

/**
 * DispositifId represents a unique identifier for a Dispositif.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Dispositif` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type DispositifId = Types.ObjectId | string;

// --- Mongoose Schemas ---

const DispositifMongooseSchema = zodSchema(DispositifZodSchema);
DispositifMongooseSchema.set("collection", "dispositifs");
DispositifMongooseSchema.set("timestamps", { createdAt: "created_at" });

// Configure _id: false for nested schemas where appropriate
// Metadatas children
const metadatasPath = DispositifMongooseSchema.path("metadatas") as any;
if (metadatasPath && metadatasPath.schema) {
  metadatasPath.schema.set("_id", false);
  const agePath = metadatasPath.schema.path("age") as any;
  if (agePath && agePath.schema) agePath.schema.set("_id", false);

  const pricePath = metadatasPath.schema.path("price") as any;
  if (pricePath && pricePath.schema) pricePath.schema.set("_id", false);

  const commitmentPath = metadatasPath.schema.path("commitment") as any;
  if (commitmentPath && commitmentPath.schema) commitmentPath.schema.set("_id", false);

  const frequencyPath = metadatasPath.schema.path("frequency") as any;
  if (frequencyPath && frequencyPath.schema) frequencyPath.schema.set("_id", false);
}

// Administration Logo
const adminLogoPath = DispositifMongooseSchema.path("administrationLogo") as any;
if (adminLogoPath && adminLogoPath.schema) adminLogoPath.schema.set("_id", false);

// Note: suggestions, merci, avis, map (Poi) usually HAVE _ids in Mongoose default.
// The original schema didn't set _id: false for them, so we keep defaults (TRUE).

export const DispositifModel = model("Dispositif", DispositifMongooseSchema);
export const DispositifDraftModel = model(
  "DispositifDraft",
  DispositifMongooseSchema,
  "dispositifs_draft",
);
