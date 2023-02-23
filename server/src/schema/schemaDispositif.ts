import mongoose, { ObjectId } from "mongoose";
import { User } from "../typegoose";

function arrayThemesLimit(val: any[]) {
  return val.length <= 2;
}

var dispositifSchema = new mongoose.Schema(
  {
    titreMarque: {
      type: Object,
      unique: false,
      required: false
    },
    titreInformatif: {
      type: Object,
      unique: false,
      required: true
    },
    abstract: {
      type: Object,
      unique: false,
      required: false
    },
    contact: {
      type: String,
      unique: false,
      required: false
    },
    externalLink: {
      type: String,
      unique: false,
      required: false
    },
    contenu: {
      type: Object,
      unique: false,
      required: false
    },
    sponsors: {
      type: Object,
      unique: false,
      required: false
    },
    mainSponsor: { type: mongoose.Types.ObjectId, ref: "Structure" },
    audience: {
      type: Object,
      unique: false,
      required: false
    },
    audienceAge: {
      type: Object,
      unique: false,
      required: false
    },
    tags: {
      type: Object,
      unique: false,
      required: false
    },
    theme: {
      type: mongoose.Types.ObjectId,
      ref: "Theme"
    },
    secondaryThemes: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Theme"
        }
      ],
      validate: [arrayThemesLimit, "{PATH} exceeds the limit of 2"]
    },
    localisation: {
      type: Object,
      unique: false,
      required: false
    },
    niveauFrancais: {
      type: Object,
      unique: false,
      required: false
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
        "Supprimé"
      ]
    },
    nbMots: {
      type: Number,
      unique: false,
      required: false
    },
    merci: {
      type: Object,
      required: false
    },
    pasMerci: {
      type: Object,
      required: false
    },
    bravo: {
      type: Object,
      required: false
    },
    suggestions: {
      type: Object,
      required: false
    },
    questions: {
      type: Object,
      required: false
    },
    signalements: {
      type: Object,
      required: false
    },
    traductions: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Traduction" }],
      required: false
    },
    participants: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      required: false
    },
    avancement: {
      type: Object,
      required: false
    },
    timeSpent: {
      type: Number,
      unique: false,
      required: false
    },
    variantes: {
      type: Object,
      unique: false,
      required: false
    },
    typeContenu: {
      type: String,
      unique: false,
      required: false,
      enum: ["dispositif", "demarche"]
    },
    demarcheId: { type: mongoose.Types.ObjectId, ref: "Dispositif" },
    autoSave: {
      type: Boolean,
      unique: false,
      required: false
    },

    publishedAt: {
      type: Date
    },
    publishedAtAuthor: { type: mongoose.Types.ObjectId, ref: "User" },
    lastModificationDate: {
      type: Date
    },
    lastModificationAuthor: { type: mongoose.Types.ObjectId, ref: "User" },
    adminComments: {
      type: String,
      required: false
    },
    adminProgressionStatus: {
      type: String,
      required: false
    },
    adminPercentageProgressionStatus: {
      type: String,
      required: false
    },
    lastAdminUpdate: {
      type: Date,
      required: false
    },
    nbVues: {
      type: Number,
      unique: false,
      required: false
    },
    draftReminderMailSentDate: {
      type: Date,
      unique: false,
      required: false
    },
    draftSecondReminderMailSentDate: {
      type: Date,
      unique: false,
      required: false
    },
    lastReminderMailSentToUpdateContentDate: {
      type: Date,
      unique: false,
      required: false
    },
    needs: [{ type: mongoose.Types.ObjectId, ref: "Needs" }],
    nbVuesMobile: {
      type: Number,
      unique: false,
      required: false
    },
    nbFavoritesMobile: {
      type: Number,
      unique: false,
      required: false
    },
    notificationsSent: {
      type: Object,
      unique: false,
      required: false
    },
    themesSelectedByAuthor: {
      type: Boolean,
      required: false
    },
    webOnly: {
      type: Boolean,
      required: false
    }
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
  audience?: Object;
  audienceAge?: Object;
  localisation?: Object;
  niveauFrancais?: Object;
  creatorId: ObjectId | User;
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
  typeContenu: "dispositif" | "demarche";
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
  lastReminderMailSentToUpdateContentDate?: number;
  status: string;
  needs?: ObjectId[];
  nbVuesMobile?: number;
  nbFavoritesMobile?: number;
  notificationsSent?: Record<string, boolean>;
  themesSelectedByAuthor?: boolean;
  webOnly?: boolean;
}

export const Dispositif = mongoose.model<DispositifDoc>("Dispositif", dispositifSchema);
