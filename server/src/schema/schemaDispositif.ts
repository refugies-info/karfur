import mongoose, { ObjectId } from "mongoose";
import { UserDoc } from "./schemaUser";

var dispositifSchema = new mongoose.Schema(
  {
    titreMarque: {
      type: Object,
      unique: false,
      required: false,
    },
    titreInformatif: {
      type: Object,
      unique: false,
      required: true,
    },
    abstract: {
      type: Object,
      unique: false,
      required: false,
    },
    contact: {
      type: String,
      unique: false,
      required: false,
    },
    externalLink: {
      type: String,
      unique: false,
      required: false,
    },
    contenu: {
      type: Object,
      unique: false,
      required: false,
    },
    sponsors: {
      type: Object,
      unique: false,
      required: false,
    },
    mainSponsor: { type: mongoose.Types.ObjectId, ref: "Structure" },
    audience: {
      type: Object,
      unique: false,
      required: false,
    },
    audienceAge: {
      type: Object,
      unique: false,
      required: false,
    },
    tags: {
      type: Object,
      unique: false,
      required: false,
    },
    localisation: {
      type: Object,
      unique: false,
      required: false,
    },
    niveauFrancais: {
      type: Object,
      unique: false,
      required: false,
    },
    creatorId: { type: mongoose.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      unique: false,
      required: false,
      enum: [
        "Actif",
        "Accepté structure",
        "En attente",
        "En attente admin",
        "En attente non prioritaire",
        "Brouillon",
        "Rejeté structure",
        "Rejeté admin",
        "Inactif",
        "Supprimé",
      ],
    },
    nbMots: {
      type: Number,
      unique: false,
      required: false,
    },
    merci: {
      type: Object,
      required: false,
    },
    pasMerci: {
      type: Object,
      required: false,
    },
    bravo: {
      type: Object,
      required: false,
    },
    suggestions: {
      type: Object,
      required: false,
    },
    questions: {
      type: Object,
      required: false,
    },
    signalements: {
      type: Object,
      required: false,
    },
    traductions: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Traduction" }],
      required: false,
    },
    participants: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      required: false,
    },
    avancement: {
      type: Object,
      required: false,
    },
    timeSpent: {
      type: Number,
      unique: false,
      required: false,
    },
    variantes: {
      type: Object,
      unique: false,
      required: false,
    },
    typeContenu: {
      type: String,
      unique: false,
      required: false,
      enum: ["dispositif", "demarche"],
    },
    demarcheId: { type: mongoose.Types.ObjectId, ref: "Dispositif" },
    autoSave: {
      type: Boolean,
      unique: false,
      required: false,
    },

    publishedAt: {
      type: Date,
    },
    lastModificationDate: {
      type: Date,
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
    lastAdminUpdate: {
      type: Date,
      required: false,
    },
    nbVues: {
      type: Number,
      unique: false,
      required: false,
    },
    draftReminderMailSentDate: {
      type: Date,
      unique: false,
      required: false,
    },
  },
  // @ts-ignore
  { timestamps: { createdAt: "created_at" } }
);

export interface DispositifDoc extends mongoose.Document {
  _id: ObjectId;
  titreMarque?: Record<string, string> | string;
  titreInformatif: Record<string, string> | string;
  abstract?: Object;
  contact?: string;
  externalLink?: string;
  contenu?: Object;
  sponsors?: Object;
  mainSponsor?: ObjectId;
  audience?: Object;
  audienceAge?: Object;
  tags?: Object;
  localisation?: Object;
  niveauFrancais?: Object;
  creatorId: ObjectId | UserDoc;
  nbMots?: number;
  merci?: Object[];
  pasMerci?: Object;
  bravo?: Object;
  suggestions?: Object;
  questions?: Object;
  signalements?: Object;
  traductions?: ObjectId[];
  participants?: ObjectId[];
  avancement?: Object;
  timeSpent?: number;
  variantes?: Object;
  typeContenu?: "dispositif" | "demarche";
  demarcheId?: ObjectId;
  autoSave?: boolean;
  publishedAt?: number;
  created_at: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus: string;
  lastAdminUpdate?: number;
  nbVues?: number;
  lastModificationDate?: number;
  updatedAt: number;
  draftReminderMailSentDate?: number;
  status: string;
}

export interface DispositifNotPopulateDoc extends DispositifDoc {
  creatorId: ObjectId;
}

export interface DispositifPopulatedDoc extends DispositifDoc {
  creatorId: UserDoc;
}

export const Dispositif = mongoose.model<DispositifDoc>(
  "Dispositif",
  dispositifSchema
);
