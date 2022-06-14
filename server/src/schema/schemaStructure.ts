import mongoose, { ObjectId } from "mongoose";
import { Picture, OpeningHours } from "../types/interface";
import { Moment } from "moment";
import { DispositifDoc } from "./schemaDispositif";

var structureSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      unique: false,
      required: true,
    },
    acronyme: {
      type: String,
      unique: false,
      required: false,
    },
    link: {
      type: String,
      unique: false,
      required: false,
    },
    contact: {
      type: String,
      unique: false,
      required: false,
    },
    mail_contact: {
      type: String,
      unique: false,
      required: false,
    },
    phone_contact: {
      type: String,
      unique: false,
      required: false,
    },
    picture: {
      type: Object,
      unique: false,
      required: false,
    },
    siren: {
      type: String,
      unique: false,
      required: false,
    },
    siret: {
      type: String,
      unique: false,
      required: false,
    },
    adresse: {
      type: Object,
      unique: false,
      required: false,
    },
    mail_generique: {
      type: Object,
      unique: false,
      required: false,
    },
    authorBelongs: {
      type: Boolean,
      unique: false,
      required: false,
    },
    status: {
      type: String,
      unique: false,
      required: false,
    },
    dispositifsAssocies: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Dispositif" }],
      required: false,
    },
    createur: { type: mongoose.Types.ObjectId, ref: "User" },
    administrateur: { type: mongoose.Types.ObjectId, ref: "User" },
    membres: {
      type: Object,
      required: false,
    },
    structureTypes: { type: Array, unique: false, required: false },
    websites: { type: Array, unique: false, required: false },
    twitter: { type: String, unique: false, required: false },
    facebook: { type: String, unique: false, required: false },
    linkedin: { type: String, unique: false, required: false },
    activities: { type: Array, unique: false, required: false },
    departments: { type: Array, unique: false, required: false },
    phonesPublic: { type: Array, unique: false, required: false },
    mailsPublic: { type: Array, unique: false, required: false },
    adressPublic: { type: String, unique: false, required: false },
    openingHours: { type: Object, unique: false, required: false },
    onlyWithRdv: { type: Boolean, unique: false, required: false },
    description: { type: String, unique: false, required: false },
    hasResponsibleSeenNotification: {
      type: Boolean,
      unique: false,
      required: false,
    },
    adminComments: {
      type: String,
      required: false,
    },
    adminProgressionStatus: {
      type: String,
      required: false,
    },
    adminPercentageProgressionStatus: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface StructureDoc extends mongoose.Document {
  _id: ObjectId;
  membres?: { userId: ObjectId; roles: string[]; added_at?: Moment }[];
  acronyme?: string;
  administrateur: ObjectId;
  adresse?: string;
  authorBelongs?: boolean;
  contact?: string;
  created_at: Moment;
  createur: ObjectId;
  dispositifsAssocies?: ObjectId[] | DispositifDoc[];
  link?: string;
  mail_contact?: string;
  mail_generique?: string;
  nom: string;
  phone_contact?: string;
  siren?: string;
  siret?: string;
  status?: string;
  updatedAt: Moment;
  picture?: Picture;
  structureTypes?: string[];
  websites?: string[];
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  activities?: string[];
  departments?: string[];
  phonesPublic?: string[];
  adressPublic?: string;
  openingHours?: OpeningHours;
  onlyWithRdv?: boolean;
  description?: string;
  hasResponsibleSeenNotification?: boolean;
  disposAssociesLocalisation?: string[];
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus: string;
}

export interface StructureSimplifiedWithLoc extends mongoose.Document {
  _id: ObjectId;
  acronyme?: string;
  picture?: Picture;
  structureTypes?: string[];
  departments?: string[];
  disposAssociesLocalisation?: string[];
}

export const Structure = mongoose.model<StructureDoc>(
  "Structure",
  structureSchema
);
