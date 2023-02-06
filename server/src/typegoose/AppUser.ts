import { modelOptions, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";
import { Base } from "./Base";

export class NotificationsSettings {
  @prop()
  public global!: boolean;

  @prop()
  local!: boolean;

  @prop()
  demarches!: boolean;

  @prop()
  themes!: {
    [key: string]: boolean;
  };
}

@modelOptions({ schemaOptions: { collection: "appusers", timestamps: true } })
export class AppUser extends Base {
  @prop({ unique: true, required: true })
  public uid!: string;

  @prop()
  public city?: string;

  @prop()
  public department?: string;

  @prop()
  public selectedLanguage?: string;

  @prop()
  public age?: string;

  @prop()
  public frenchLevel?: string;

  @prop()
  public expoPushToken?: string;

  @prop({ type: Schema.Types.Mixed })
  public notificationsSettings?: NotificationsSettings;
}
