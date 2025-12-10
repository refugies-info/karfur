import { StructureStatus } from "@refugies-info/api-types";
import { type Document, model, Schema, type Types } from "mongoose";
import { z } from "zod";
import { type Image, ImageSchema, ImageZodSchema } from "./generics";
import { type User, UserId } from "./User";

// --- Zod Schemas ---

export const MembreZodSchema = z.object({
  userId: z.any(), // Ref User
  added_at: z.date(),
});

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
  administrateur: z.any().optional(), // Ref User
  adresse: z.string().optional(),
  authorBelongs: z.boolean().optional(),
  contact: z.string().optional(),
  createur: z.any(), // Ref User
  link: z.string().optional(),
  mail_contact: z.string().optional(),
  mail_generique: z.string().optional(),
  nom: z.string(),
  phone_contact: z.string().optional(),
  siren: z.string().optional(),
  siret: z.string().optional(),
  status: z.nativeEnum(StructureStatus).optional(),
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

export type StructureType = z.infer<typeof StructureZodSchema>;

// --- Interfaces ---

export interface Membre {
  userId: Types.ObjectId | User;
  added_at: Date;
}

export interface DetailedOpeningHours {
  day: string;
  from0?: string;
  to0?: string;
  from1?: string;
  to1?: string;
}

export interface OpeningHours {
  details: DetailedOpeningHours[];
  noPublic?: boolean;
  precisions?: string;
}

export interface Structure extends Document {
  _id: Types.ObjectId;
  membres?: Membre[];
  acronyme?: string;
  administrateur?: Types.ObjectId | User;
  adresse?: string;
  authorBelongs?: boolean;
  contact?: string;
  createur: Types.ObjectId | User;
  link?: string;
  mail_contact?: string;
  mail_generique?: string;
  nom: string;
  phone_contact?: string;
  siren?: string;
  siret?: string;
  status?: StructureStatus;
  picture?: Image;
  structureTypes?: string[];
  websites?: string[];
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  activities?: string[];
  departments?: string[];
  phonesPublic?: string[];
  mailsPublic?: string[];
  adressPublic?: string;
  openingHours?: OpeningHours;
  onlyWithRdv?: boolean;
  description?: string;
  hasResponsibleSeenNotification?: boolean;
  disposAssociesLocalisation?: string[];
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string; // Typegoose said string, implicit optional?
  created_at?: Date;
  updatedAt?: Date;
}

export type StructureId = Structure["_id"] | Structure["id"];

// --- Schemas ---

const MembreSchema = new Schema<Membre>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    added_at: { type: Date, required: true },
  },
  { _id: false },
);

const DetailedOpeningHoursSchema = new Schema<DetailedOpeningHours>(
  {
    day: { type: String, required: true },
    from0: { type: String },
    to0: { type: String },
    from1: { type: String },
    to1: { type: String },
  },
  { _id: false },
);

const OpeningHoursSchema = new Schema<OpeningHours>(
  {
    details: { type: [DetailedOpeningHoursSchema], required: true },
    noPublic: { type: Boolean },
    precisions: { type: String },
  },
  { _id: false },
);

const StructureSchema = new Schema<Structure>(
  {
    membres: { type: [MembreSchema] },
    acronyme: { type: String },
    administrateur: { type: Schema.Types.ObjectId, ref: "User" },
    adresse: { type: String },
    authorBelongs: { type: Boolean },
    contact: { type: String },
    createur: { type: Schema.Types.ObjectId, ref: "User", required: true },
    link: { type: String },
    mail_contact: { type: String },
    mail_generique: { type: String },
    nom: { type: String, required: true },
    phone_contact: { type: String },
    siren: { type: String },
    siret: { type: String },
    status: { type: String, enum: Object.values(StructureStatus) },
    picture: { type: ImageSchema, _id: false },
    structureTypes: { type: [String], default: [] },
    websites: { type: [String], default: [] },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    activities: { type: [String], default: [] },
    departments: { type: [String], default: [] },
    phonesPublic: { type: [String], default: [] },
    mailsPublic: { type: [String], default: [] },
    adressPublic: { type: String },
    openingHours: { type: OpeningHoursSchema, _id: false },
    onlyWithRdv: { type: Boolean },
    description: { type: String },
    hasResponsibleSeenNotification: { type: Boolean },
    disposAssociesLocalisation: { type: [String] },
    adminComments: { type: String },
    adminProgressionStatus: { type: String },
    adminPercentageProgressionStatus: { type: String },
  },
  {
    collection: "structures",
    timestamps: { createdAt: "created_at" },
  },
);

export const StructureModel = model<Structure>("Structure", StructureSchema);
