import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Languages } from "@refugies-info/api-types";
import { isInteger } from "lodash";
import { Dispositif } from "./Dispositif";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "indicators", timestamps: true } })
export class Indicator {
  @prop({ type: String, required: true })
  public language!: Languages;

  @prop({ validate: (value: any) => isInteger(value) && value > 0, required: true })
  public wordsCount!: Number;

  @prop({ ref: () => Dispositif, required: true })
  public dispositifId!: Ref<Dispositif>;

  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ validate: (v: any) => isInteger(v) && v > 0, required: true })
  public timeSpent!: Number;
}
