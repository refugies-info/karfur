import { modelOptions, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class AppUser {
  @prop({ unique: true, required: true })
  public uid!: String;

  @prop()
  public city?: String;

  @prop()
  public department?: String;

  @prop()
  public selectedLanguage?: String;

  @prop()
  public age?: String;

  @prop()
  public frenchLevel?: String;

  @prop()
  public expoPushToken?: String;

  @prop({ type: Schema.Types.Mixed })
  public notificationsSettings?: any;
}
