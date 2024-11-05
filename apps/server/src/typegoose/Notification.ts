import { modelOptions, prop } from "@typegoose/typegoose";
import { Base } from "./Base";

@modelOptions({ schemaOptions: { collection: "notifications", timestamps: true } })
export class Notification extends Base {
  @prop({ required: true })
  public uid!: string;

  @prop({ required: true, default: false })
  public seen!: boolean;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public data!: Object;
}
