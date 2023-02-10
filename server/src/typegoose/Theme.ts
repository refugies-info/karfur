import { modelOptions, prop } from "@typegoose/typegoose";
import { isInteger } from "lodash";
import { ExcludeMethods } from "../types/interface";
import { Base } from "./Base";
import { ImageSchema } from "./generics";
import { Langue } from "./Langue";

class ThemeColors {
  @prop()
  color100!: string;
  @prop()
  color80!: string;
  @prop()
  color60!: string;
  @prop()
  color40!: string;
  @prop()
  color30!: string;
}

@modelOptions({ schemaOptions: { collection: "themes" } })
export class Theme extends Base {
  @prop()
  public name: Record<string, string>;

  @prop()
  public short: Record<string, string>;

  @prop()
  public colors: ThemeColors;

  @prop({
    type: Number,
    validate: { validator: (v: any) => isInteger(v) && v >= 0, message: "position must be an positive integer" }
  })
  public position!: number;

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
  public notificationEmoji!: string;

  @prop()
  public adminComments?: string;

  public isActive(activeLanguages: Langue[]) {
    // titles
    for (const ln of activeLanguages) {
      if (!this.name?.[ln.i18nCode] || !this.short?.[ln.i18nCode]) return false;
    }

    if (
      // colors
      !this.colors.color100 ||
      !this.colors.color80 ||
      !this.colors.color60 ||
      !this.colors.color40 ||
      !this.colors.color30 ||
      // images
      !this.icon.secure_url ||
      !this.banner.secure_url ||
      !this.appImage.secure_url ||
      !this.shareImage.secure_url ||
      !this.notificationEmoji
    ) {
      return false;
    }
    return true;
  }
}

export type ThemeId = ExcludeMethods<Theme["_id"] | Theme["id"]>;
