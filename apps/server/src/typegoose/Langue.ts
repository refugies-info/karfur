import { Languages } from "@refugies-info/api-types";
import { modelOptions, prop } from "@typegoose/typegoose";
import { Base } from "./Base";

@modelOptions({ schemaOptions: { collection: "langues", timestamps: { createdAt: "created_at" } } })
export class Langue extends Base {
  @prop({ unique: true, required: true })
  public langueFr!: string;

  @prop()
  public langueLoc?: string;

  @prop()
  public langueCode?: string;

  @prop({ required: true, unique: true })
  public i18nCode!: Languages;

  @prop({ default: 0 })
  public avancement: number;

  @prop({ default: 0 })
  public avancementTrad: number;
}

export type LangueId = Langue["_id"] | Langue["id"];
