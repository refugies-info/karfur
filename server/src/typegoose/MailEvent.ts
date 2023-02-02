import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Dispositif } from "./Dispositif";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "Mail", timestamps: { createdAt: "created_at" } } })
export class MailEvent {
  @prop({ required: true })
  public templateName!: String;

  @prop({ required: true })
  public email!: String;

  @prop()
  public username?: String;

  @prop()
  public langue?: String;

  @prop({ ref: () => User })
  public userId?: Ref<User>;

  @prop({ ref: () => Dispositif })
  public dispositifId?: Ref<Dispositif>;
}
