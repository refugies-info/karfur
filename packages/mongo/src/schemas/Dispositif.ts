import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { z } from "zod";
import { type ImageType, ImageZodSchema } from "./generics";
import { I18nCodeZodSchema } from "./Langue";

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

// --- Mongoose-compatible schema (relaxed for zod-mongoose limitations) ---
// Note: Union types pick first inner type, so we use z.any() for complex unions
// See: https://github.com/git-zodyac/mongoose/blob/main/SUPPORTED.md
export const MetadatasZodSchema = z.object({
  // PATCHED: Union(string, array) not supported - relaxed for Mongoose
  location: z.any().optional().nullable(),
  frenchLevel: z.array(z.string()).optional().nullable(),
  // PATCHED: Nested optional objects with required fields cause validation issues
  age: z.any().optional().nullable(),
  price: z.any().optional().nullable(),
  publicStatus: z.array(z.string()).optional().nullable(),
  public: z.array(z.string()).optional().nullable(),
  conditions: z.array(z.string()).optional().nullable(),
  // PATCHED: Nested optional objects with required fields cause validation issues
  commitment: z.any().optional().nullable(),
  frequency: z.any().optional().nullable(),
  timeSlots: z.array(z.string()).optional().nullable(),
});

// --- Strict TypeScript types (what the app actually uses) ---
export type Metadatas = {
  location?: string | string[] | null;
  frenchLevel?: string[] | null;
  age?: Age | null;
  price?: Price | null;
  publicStatus?: string[] | null;
  public?: string[] | null;
  conditions?: string[] | null;
  commitment?: Commitment | null;
  frequency?: Frequency | null;
  timeSlots?: string[] | null;
};

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
// PATCHED: z.record() converts to Mongoose Map, causing object['key'] vs Map.get('key') issues
// We use z.any() for Mongoose schema generation, but export strict TS types

export const DispositifContentZodSchema = z.object({
  titreInformatif: z.string(),
  titreMarque: z.string(),
  abstract: z.string(),
  what: z.string(),
  // PATCHED: z.record() → Map in Mongoose, relaxed for compatibility
  why: z.any(),
  how: z.any(),
});
// Strict type for application code
export type DispositifContent = {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  what: string;
  why: Record<string, InfoSection>;
  how: Record<string, InfoSection>;
};

export const DemarcheContentZodSchema = z.object({
  titreInformatif: z.string(),
  titreMarque: z.string(),
  abstract: z.string(),
  what: z.string(),
  // PATCHED: z.record() → Map in Mongoose, relaxed for compatibility
  how: z.any(),
  next: z.any(),
  administrationName: z.string().nullable(),
});
// Strict type for application code
export type DemarcheContent = {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  what: string;
  how: Record<string, InfoSection>;
  next: Record<string, InfoSection>;
  administrationName: string | null;
};

export const TranslationContentZodSchema = z.object({
  // PATCHED: Union picks first type only, relaxed for Mongoose compatibility
  content: z.any(),
  created_at: z.date(),
  validatorId: zId("User"),
});
// Strict type for application code
export type TranslationContent = {
  content: DispositifContent | DemarcheContent;
  created_at: Date;
  validatorId: Types.ObjectId;
};

// --- Main Dispositif Schema ---
// PATCHED fields marked below - see type patching comments above

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
  // PATCHED: Union in array not supported, relaxed for Mongoose
  sponsors: z.array(z.any()).optional(),
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
  // PATCHED: z.record() → Map in Mongoose, relaxed for compatibility
  notificationsSent: z.any().optional(),

  suggestions: z.array(SuggestionZodSchema).optional(),
  merci: z.array(MerciZodSchema).optional(),
  avis: z.array(AvisZodSchema).optional(),
  webOnly: z.boolean().optional(),

  // PATCHED: z.record() → Map in Mongoose, relaxed for compatibility
  translations: z.any().optional(),
  metadatas: MetadatasZodSchema.optional(),
  map: z.array(PoiZodSchema).nullable().optional(),
  // PATCHED: Nested optional with required fields causes validation issues
  administrationLogo: z.any().nullable().optional(),
});

// --- Strict TypeScript type for Dispositif ---
// Base inferred type from Zod schema
type DispositifBase = z.infer<typeof DispositifZodSchema>;

// Patched type with correct strict types for relaxed fields
export type Dispositif = Omit<
  DispositifBase,
  "sponsors" | "notificationsSent" | "translations" | "administrationLogo"
> & {
  sponsors?: (Types.ObjectId | Sponsor)[];
  notificationsSent?: Record<string, boolean>;
  translations?: Record<string, TranslationContent>;
  administrationLogo?: ImageType | null;
} & Document<Types.ObjectId>;

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
DispositifMongooseSchema.set("toObject", { flattenMaps: true });
DispositifMongooseSchema.set("toJSON", { flattenMaps: true });

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

DispositifMongooseSchema.plugin(SpeedGooseCacheAutoCleaner);

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const DispositifModel = (models.Dispositif ||
  model("Dispositif", DispositifMongooseSchema)) as unknown as Model<Dispositif>;
export const DispositifDraftModel = (models.DispositifDraft ||
  model(
    "DispositifDraft",
    DispositifMongooseSchema,
    "dispositifs_draft",
  )) as unknown as Model<Dispositif>;
