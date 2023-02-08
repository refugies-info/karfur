import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "traductions", timestamps: { createdAt: "created_at" } } })
export class Traductions extends Base {
  @prop({ required: true })
  public langueCible!: string;

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
  public status: string;

  @prop()
  public path: Object;

  @prop()
  public rightId: string;

  @prop()
  public timeSpent: number;

  @prop()
  public nbMots: number;

  @prop()
  public jsonId: string;

  @prop()
  public avancement: number;

  @prop()
  public type: string;

  @prop()
  public title: string;

  @prop()
  public score: number;

  @prop()
  public isExpert: Boolean;

  @prop()
  public updatedAt: number;
}

export type TraductionId = Traductions["_id"] | Traductions["id"];
