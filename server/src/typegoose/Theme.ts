import { prop } from "@typegoose/typegoose";
import { isInteger } from "lodash";
import { ImageSchema } from "./generics";

class ThemeColors {
  color100!: String;
  color80!: String;
  color60!: String;
  color40!: String;
  color30!: String;
}

export class Theme {
  @prop()
  public name: Record<string, String>;

  @prop()
  public short: Record<string, String>;

  @prop()
  public colors: ThemeColors;

  @prop({
    type: Number,
    validate: { validator: (v: any) => isInteger(v) && v >= 0, message: "position must be an positive integer" }
  })
  public position!: Number;

  @prop()
  public icon: ImageSchema;

  @prop()
  public banner: ImageSchema;

  @prop()
  public appBanner: ImageSchema;

  @prop()
  public appImage: ImageSchema;

  @prop()
  public shareImage: ImageSchema;

  @prop()
  public notificationEmoji!: String;

  @prop()
  public adminComments?: String;
}
