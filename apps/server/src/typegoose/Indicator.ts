import type { Languages } from "@refugies-info/api-types";
import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { isInteger } from "lodash";
import { Dispositif } from "./Dispositif";
import type { User } from "./User";

@modelOptions({ schemaOptions: { collection: "indicators", timestamps: true } })
export class Indicator {
  @prop({ type: String, required: true })
  public language!: Languages;

  @prop({ validate: (value: unknown) => isInteger(value) && Number(value) > 0, required: true })
  public wordsCount!: number;

  @prop({ ref: () => Dispositif, required: true })
  public dispositifId!: Ref<Dispositif>;

  @prop({ ref: "User", required: true })
  public userId!: Ref<User>;

  @prop({ validate: (v: unknown) => isInteger(v) && Number(v) > 0, required: true })
  public timeSpent!: number;
}
