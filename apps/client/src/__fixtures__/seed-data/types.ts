import type mongoose from "mongoose";

export interface NeedSeedIds {
  NA1: mongoose.Types.ObjectId;
  NA2: mongoose.Types.ObjectId;
  NB1: mongoose.Types.ObjectId;
}

export interface NeedDocument {
  _id: mongoose.Types.ObjectId;
  theme: mongoose.Types.ObjectId;
}

export interface ThemeSeedIds {
  TA: mongoose.Types.ObjectId;
  TB: mongoose.Types.ObjectId;
  TC: mongoose.Types.ObjectId;
}

export interface ThemeDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  short: string;
  position: number;
}
