import mongoose, { ObjectId } from "mongoose";
// @ts-ignore
import passwordHash from "password-hash";
import jwt from "jwt-simple";
import { LangueDoc } from "./schemaLangue";
import { Picture } from "../types/interface";
let config = {};
if (process.env.NODE_ENV === "dev") {
  config = require("../config/config");
}

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: false,
      required: false,
    },
    phone: {
      type: String,
      unique: false,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    objectifTemps: {
      type: Number,
      required: false,
    },
    objectifMots: {
      type: Number,
      required: false,
    },
    notifyObjectifs: {
      type: Boolean,
      required: false,
    },
    objectifTempsContrib: {
      type: Number,
      required: false,
    },
    objectifMotsContrib: {
      type: Number,
      required: false,
    },
    notifyObjectifsContrib: {
      type: Boolean,
      required: false,
    },
    picture: {
      type: Object,
      required: false,
    },
    roles: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Role" }],
      required: false,
    },
    selectedLanguages: {
      type: Array,
      required: false,
    },
    traductionsFaites: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Traduction" }],
      required: false,
    },
    contributions: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Dispositif" }],
      required: false,
    },
    noteTraduction: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    cookies: {
      type: Object,
      required: false,
    },
    structures: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Structure" }],
      required: false,
    },
    last_connected: {
      type: Date,
      required: false,
    },
    authy_id: {
      type: String,
      required: false,
    },
    reset_password_token: {
      type: String,
      required: false,
    },
    reset_password_expires: {
      type: Date,
      required: false,
    },
  },
  // @ts-ignore
  { timestamps: { createdAt: "created_at" } }
);

// @ts-ignore
userSchema.methods = {
  authenticate: function (password: string) {
    // @ts-ignore

    return passwordHash.verify(password, this.password);
  },
  getToken: function () {
    return jwt.encode(
      {
        // @ts-ignore
        _id: this._id,
        // @ts-ignore
        username: this.username,
        // @ts-ignore
        password: this.password,
        // @ts-ignore
        email: this.email,
      },
      // @ts-ignore
      process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET
    );
  },
};

export interface UserDoc extends mongoose.Document {
  username: string;

  password: string;
  email?: string;

  phone?: string;
  description?: string;

  objectifTemps?: number;

  objectifMots?: number;
  notifyObjectifs?: boolean;

  objectifTempsContrib?: number;

  objectifMotsContrib?: number;

  notifyObjectifsContrib?: boolean;

  picture?: Picture;

  roles?: ObjectId[];

  selectedLanguages?: LangueDoc[];
  traductionsFaites?: ObjectId[];
  contributions?: ObjectId[];
  noteTraduction?: number;

  status?: string;
  cookies?: {
    parkourPinned: Object;
    dispositifsPinned: { _id: ObjectId; datePin: Date }[];
  };

  structures?: ObjectId[];
  last_connected?: number;
  authy_id?: string;
  reset_password_token?: string;
  reset_password_expires?: number;
  _id: ObjectId;
  created_at: Date;
}

export const User = mongoose.model<UserDoc>("User", userSchema);
