import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { User } from "./User";

@modelOptions({ schemaOptions: { timestamps: { createdAt: "created_at" } } })
export class Langue {
  @prop({ unique: true, required: true })
  public langueFr!: String;

  @prop()
  public langueLoc?: String;

  @prop()
  public langueCode?: String;

  // FIXME : toujours utilisé ?
  @prop()
  public langueIsDialect?: Boolean;

  // FIXME : toujours utilisé ?
  // Présent dans le code mais semble apporter trop de complexité pour rien
  @prop()
  public langueBackupId?: Ref<Langue>;

  // FIXME meilleur typage à faire + toujours utile ?
  @prop()
  public status?: String;

  @prop({ required: true, unique: true })
  public i18nCode!: String;

  @prop({ default: 0 })
  public avancement: Number;

  @prop({ default: 0 })
  public avancementTrad: Number;

  // FIXME dépendance circulaire
  // Utiliser => https://typegoose.github.io/typegoose/docs/api/virtuals/#why-is-my-virtual-not-included-in-the-output ?
  @prop({ default: [] })
  public participants?: Ref<User>;
}
