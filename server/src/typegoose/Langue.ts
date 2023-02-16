import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "langues", timestamps: { createdAt: "created_at" } } })
export class Langue extends Base {
  @prop({ unique: true, required: true })
  public langueFr!: string;

  @prop()
  public langueLoc?: string;

  @prop()
  public langueCode?: string;

  // FIXME : toujours utilisé ?
  @prop()
  public langueIsDialect?: Boolean;

  // FIXME : toujours utilisé ?
  // Présent dans le code mais semble apporter trop de complexité pour rien
  @prop()
  public langueBackupId?: Ref<Langue>;

  // FIXME meilleur typage à faire + toujours utile ?
  @prop()
  public status?: string;

  @prop({ required: true, unique: true })
  public i18nCode!: string;

  @prop({ default: 0 })
  public avancement: number;

  @prop({ default: 0 })
  public avancementTrad: number;

  // FIXME dépendance circulaire
  // Utiliser => https://typegoose.github.io/typegoose/docs/api/virtuals/#why-is-my-virtual-not-included-in-the-output ?
  @prop({ default: [], ref: () => User })
  public participants?: Ref<User>[];
}

export type LangueId = Langue["_id"] | Langue["id"];
