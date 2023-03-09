import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "mails", timestamps: { createdAt: "created_at" } } })
export class MailEvent extends Base {
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
