import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import type { User } from "./User";

@modelOptions({ schemaOptions: { collection: "errors", timestamps: true } })
export class Error {
  @prop()
  public name: string;

  @prop({ ref: "User" })
  public userId?: Ref<User>;

  @prop()
  public dataObject: object;

  @prop()
  public error: object;
}
