import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "traductions", timestamps: { createdAt: "created_at" } } })
export class Traductions extends Base {
  @prop({ required: true })
  public langueCible!: String;

  @prop({ required: true })
  public translatedText!: Object;

  @prop()
  public initialText: Object;

  @prop()
  public initialTranslatedText: Object;

  // FIXME
  @prop({ ref: () => User })
  public userId: Ref<User>;

  @prop({ ref: () => User })
  public validatorId: Ref<User>;

  @prop({ ref: () => Dispositif })
  public articleId!: Ref<Dispositif>;

  @prop()
  public status: String;

  @prop()
  public path: Object;

  @prop()
  public rightId: String;

  @prop()
  public timeSpent: Number;

  @prop()
  public nbMots: Number;

  @prop()
  public jsonId: String;

  @prop()
  public avancement: Number;

  @prop()
  public type: String;

  @prop()
  public title: String;

  @prop()
  public score: Number;

  @prop()
  public isExpert: Boolean;

  @prop()
  public updatedAt: Number;
}

export type TraductionId = Traductions["_id"] | Traductions["id"];
