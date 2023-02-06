import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "notifications", timestamps: true } })
export class Notification {
  @prop({ required: true })
  public uid!: string;

  @prop({ required: true, default: false })
  public seen!: boolean;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public data!: Object;
}
