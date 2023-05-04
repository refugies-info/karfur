import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "errors", timestamps: true } })
export class Error {
  @prop()
  public name: String;

  @prop({ ref: () => User })
  public userId?: Ref<User>;

  @prop()
  public dataObject: Object;

  @prop()
  public error: Object;
}
