import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Notification {
  @prop({ required: true })
  public uid!: String;

  @prop({ required: true, default: false })
  public seen!: Boolean;

  @prop({ required: true })
  public title!: String;

  @prop({ required: true })
  public data!: Object;
}
