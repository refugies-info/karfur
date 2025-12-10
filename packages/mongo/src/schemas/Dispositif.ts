import {
  ContentType,
  DispositifOrigin,
  DispositifStatus,
  Languages,
} from "@refugies-info/api-types";
import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import { ImageSchema, ImageZodSchema } from "./generics";
import type { Need } from "./Need";
import type { Structure } from "./Structure";
import type { Theme } from "./Theme";
import type { User } from "./User";

// --- Nested Types ---
export type InfoSections = Record<string, InfoSection>;

export const SponsorSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  link: z.string().optional(),
  _id: z.custom<Types.ObjectId>().optional(),
});
export type Sponsor = z.infer<typeof SponsorSchema>;

export const InfoSectionSchema = z.object({
  title: z.string(),
  text: z.string(), // RichText
  _id: z.custom<Types.ObjectId>().optional(),
});
export type InfoSection = z.infer<typeof InfoSectionSchema>;

export const SuggestionSchema = z.object({
  created_at: z.date(),
  userId: z.custom<Types.ObjectId>().optional(),
  read: z.boolean(),
  suggestion: z.string(),
  suggestionId: z.string(), // Uuid
  section: z.string(), // keyof DispositifContent | keyof DemarcheContent
  _id: z.custom<Types.ObjectId>().optional(),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const MerciSchema = z.object({
  created_at: z.date(),
  userId: z.custom<Types.ObjectId>().optional(),
  _id: z.custom<Types.ObjectId>().optional(),
});
export type Merci = z.infer<typeof MerciSchema>;

export const AvisSchema = z.object({
  created_at: z.date(),
  userId: z.custom<Types.ObjectId>().optional(),
  anonymousUserId: z.string().optional(),
  avis: z.boolean(),
  language: z.string(),
  _id: z.custom<Types.ObjectId>().optional(),
});
export type Avis = z.infer<typeof AvisSchema>;

export const AgeSchema = z.object({
  type: z.string(), // ageType
  ages: z.array(z.number()),
});
export type Age = z.infer<typeof AgeSchema>;

export const PriceSchema = z.object({
  values: z.array(z.number()),
  details: z.string().optional(), // priceDetails
});
export type Price = z.infer<typeof PriceSchema>;

export const CommitmentSchema = z.object({
  amountDetails: z.string(), // commitmentDetailsType
  hours: z.array(z.number()),
  timeUnit: z.string(), // timeUnitType
});
export type Commitment = z.infer<typeof CommitmentSchema>;

export const FrequencySchema = z.object({
  amountDetails: z.string(), // frequencyDetailsType
  hours: z.number(),
  timeUnit: z.string(), // timeUnitType
  frequencyUnit: z.string(), // frequencyUnitType
});
export type Frequency = z.infer<typeof FrequencySchema>;

export const MetadatasSchema = z.object({
  location: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(), // locationType
  frenchLevel: z.array(z.string()).optional().nullable(), // frenchLevelType[]
  age: AgeSchema.optional().nullable(),
  price: PriceSchema.optional().nullable(),
  publicStatus: z.array(z.string()).optional().nullable(), // publicStatusType[]
  public: z.array(z.string()).optional().nullable(), // publicType[]
  conditions: z.array(z.string()).optional().nullable(), // conditionType[]
  commitment: CommitmentSchema.optional().nullable(),
  frequency: FrequencySchema.optional().nullable(),
  timeSlots: z.array(z.string()).optional().nullable(), // timeSlotType[]
});
export type Metadatas = z.infer<typeof MetadatasSchema>;

export const PoiSchema = z.object({
  title: z.string(),
  address: z.string(),
  city: z.string().optional().nullable(),
  lat: z.number(),
  lng: z.number(),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  _id: z.custom<Types.ObjectId>().optional(),
});
export type Poi = z.infer<typeof PoiSchema>;

// --- Content Types ---

export const DispositifContentSchema = z.object({
  titreInformatif: z.string(),
  titreMarque: z.string(),
  abstract: z.string(),
  what: z.string(), // RichText
  why: z.record(InfoSectionSchema),
  how: z.record(InfoSectionSchema), // InfoSections
});
export type DispositifContent = z.infer<typeof DispositifContentSchema>;

export const DemarcheContentSchema = z.object({
  titreInformatif: z.string(),
  titreMarque: z.string(),
  abstract: z.string(),
  what: z.string(), // RichText
  how: z.record(InfoSectionSchema), // InfoSections
  next: z.record(InfoSectionSchema), // InfoSections
  administrationName: z.string().nullable(),
});
export type DemarcheContent = z.infer<typeof DemarcheContentSchema>;

export const TranslationContentSchema = z.object({
  content: z.union([DispositifContentSchema, DemarcheContentSchema]),
  created_at: z.date(),
  validatorId: z.custom<Types.ObjectId>(),
});

// manually defining TranslationContent type to generic object for content to avoid complex union issues in Mongoose or code
export type TranslationContent = {
  content: DispositifContent | DemarcheContent;
  created_at: Date;
  validatorId: Types.ObjectId;
};

// --- Main Dispositif Schema ---

export const DispositifSchema = z.object({
  typeContenu: z.nativeEnum(ContentType),
  status: z.nativeEnum(DispositifStatus),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
  origin: z.nativeEnum(DispositifOrigin).default(DispositifOrigin.RI),

  mainSponsor: z.custom<Types.ObjectId>().optional(), // Ref Structure
  theme: z.custom<Types.ObjectId>().optional(), // Ref Theme
  secondaryThemes: z.array(z.custom<Types.ObjectId>()).optional(), // Ref Theme
  needs: z.array(z.custom<Types.ObjectId>()).optional(), // Ref Need
  sponsors: z.array(z.union([z.custom<Types.ObjectId>(), SponsorSchema])).optional(), // Ref Structure | Sponsor
  externalLink: z.string().optional(),

  creatorId: z.custom<Types.ObjectId>(), // Ref User
  participants: z.array(z.custom<Types.ObjectId>()).optional(), // Ref User

  lastAdminUpdate: z.date().optional(),
  lastModificationAuthor: z.custom<Types.ObjectId>(), // Ref User
  lastModificationDate: z.date().optional(),
  publishedAt: z.date().optional(),
  publishedAtAuthor: z.custom<Types.ObjectId>().optional(), // Ref User
  deletionDate: z.date().optional(),

  nbFavoritesMobile: z.number().default(0),
  nbFavorites: z.number().default(0), // nbFavoritesMobile seems duplicated in Typegoose, checking
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
  notificationsSent: z.record(z.boolean()).optional(), // PartialRecord<Languages, boolean>

  suggestions: z.array(SuggestionSchema).optional(),
  merci: z.array(MerciSchema).optional(),
  avis: z.array(AvisSchema).optional(),
  webOnly: z.boolean().optional(),

  translations: z.record(z.custom<TranslationContent>()).optional(), // PartialRecord<Languages, TranslationContent>
  metadatas: MetadatasSchema.optional(),
  map: z.array(PoiSchema).nullable().optional(),
  administrationLogo: ImageZodSchema.nullable().optional(),
});

export type DispositifType = z.infer<typeof DispositifSchema> & { _id: Types.ObjectId };
export type DispositifId = Types.ObjectId | string;

export interface Dispositif
  extends Omit<
    DispositifType,
    | "mainSponsor"
    | "theme"
    | "secondaryThemes"
    | "needs"
    | "sponsors"
    | "creatorId"
    | "participants"
    | "lastModificationAuthor"
    | "publishedAtAuthor"
  > {
  mainSponsor?: Structure | Types.ObjectId;
  theme?: Theme | Types.ObjectId;
  secondaryThemes?: (Theme | Types.ObjectId)[];
  needs: (Need | Types.ObjectId)[];
  sponsors?: (Structure | Types.ObjectId | Sponsor)[];
  creatorId: User | Types.ObjectId;
  participants: (User | Types.ObjectId)[];
  lastModificationAuthor: User | Types.ObjectId;
  publishedAtAuthor?: User | Types.ObjectId;
}

// --- Mongoose Schemas ---

const SponsorMongooseSchema = new Schema<Sponsor>({
  name: { type: String, required: true },
  logo: { type: String },
  link: { type: String },
});

const InfoSectionMongooseSchema = new Schema<InfoSection>({
  title: { type: String, required: true },
  text: { type: String, required: true },
});

const SuggestionMongooseSchema = new Schema<Suggestion>({
  created_at: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, required: true },
  suggestion: { type: String, required: true },
  suggestionId: { type: String, required: true },
  section: { type: String, required: true },
});

const MerciMongooseSchema = new Schema<Merci>({
  created_at: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const AvisMongooseSchema = new Schema<Avis>({
  created_at: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  anonymousUserId: { type: String },
  avis: { type: Boolean, required: true },
  language: { type: String, required: true },
});

// Metadatas Sub-Schemas
const AgeMongooseSchema = new Schema(
  {
    type: { type: String, required: true },
    ages: [{ type: Number }],
  },
  { _id: false },
);

const PriceMongooseSchema = new Schema(
  {
    values: [{ type: Number }],
    details: { type: String },
  },
  { _id: false },
);

const CommitmentMongooseSchema = new Schema(
  {
    amountDetails: { type: String, required: true },
    hours: [{ type: Number }],
    timeUnit: { type: String, required: true },
  },
  { _id: false },
);

const FrequencyMongooseSchema = new Schema(
  {
    amountDetails: { type: String, required: true },
    hours: { type: Number, required: true },
    timeUnit: { type: String, required: true },
    frequencyUnit: { type: String, required: true },
  },
  { _id: false },
);

const MetadatasMongooseSchema = new Schema<Metadatas>(
  {
    location: { type: Schema.Types.Mixed }, // String or String[]
    frenchLevel: [{ type: String }],
    age: { type: AgeMongooseSchema },
    price: { type: PriceMongooseSchema },
    publicStatus: [{ type: String }],
    public: [{ type: String }],
    conditions: [{ type: String }],
    commitment: { type: CommitmentMongooseSchema },
    frequency: { type: FrequencyMongooseSchema },
    timeSlots: [{ type: String }],
  },
  { _id: false },
);

const PoiMongooseSchema = new Schema<Poi>({
  title: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  description: { type: String },
  email: { type: String },
  phone: { type: String },
});

export const DispositifMongooseSchema = new Schema<Dispositif>(
  {
    typeContenu: { type: String, enum: Object.values(ContentType), required: true },
    status: { type: String, enum: Object.values(DispositifStatus), required: true },
    origin: {
      type: String,
      enum: Object.values(DispositifOrigin),
      default: DispositifOrigin.RI,
      required: true,
    },

    mainSponsor: { type: Schema.Types.ObjectId, ref: "Structure" },
    theme: { type: Schema.Types.ObjectId, ref: "Theme" },
    secondaryThemes: [{ type: Schema.Types.ObjectId, ref: "Theme" }],
    needs: [{ type: Schema.Types.ObjectId, ref: "Need" }],
    sponsors: [{ type: Schema.Types.Mixed }], // Ref Structure or SponsorSchema. Typegoose uses Mixed here effectively or Array<Ref | Sponsor>
    externalLink: { type: String },

    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],

    lastAdminUpdate: { type: Date },
    lastModificationAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    lastModificationDate: { type: Date },
    publishedAt: { type: Date },
    publishedAtAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    deletionDate: { type: Date },

    nbFavoritesMobile: { type: Number, default: 0 },
    // nbFavorites: { type: Number, default: 0 },
    nbVues: { type: Number, default: 0 },
    nbVuesMobile: { type: Number, default: 0 },
    nbMots: { type: Number, default: 0 },

    adminComments: { type: String },
    adminProgressionStatus: { type: String },
    hasDraftVersion: { type: Boolean },

    draftReminderMailSentDate: { type: Date },
    draftSecondReminderMailSentDate: { type: Date },
    lastReminderMailSentToUpdateContentDate: { type: Date },

    themesSelectedByAuthor: { type: Boolean },
    notificationsSent: { type: Map, of: Boolean },

    suggestions: [SuggestionMongooseSchema],
    merci: [MerciMongooseSchema],
    avis: [AvisMongooseSchema],
    webOnly: { type: Boolean },

    translations: { type: Map, of: Object }, // TranslationContent is complex
    metadatas: { type: MetadatasMongooseSchema },
    map: [PoiMongooseSchema],
    administrationLogo: { type: ImageSchema, _id: false },
  },
  {
    collection: "dispositifs",
    timestamps: { createdAt: "created_at" },
  },
);

export const DispositifModel = model<Dispositif>("Dispositif", DispositifMongooseSchema);
export const DispositifDraftModel = model<Dispositif>(
  "DispositifDraft",
  DispositifMongooseSchema,
  "dispositifs_draft",
);
