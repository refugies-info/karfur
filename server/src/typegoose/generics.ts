import { prop } from "@typegoose/typegoose";

export class ImageSchema {
  @prop()
  secure_url!: String;

  @prop()
  public_id!: String;

  @prop()
  imgId!: String;
}

export type lnCode = string;
export type RichText = string;
export type Uuid = string;

export type Languages = "fr" | "en" | "uk" | "ti" | "ar" | "ps" | "ru";
