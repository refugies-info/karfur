import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";
import type { User } from "./User";

@modelOptions({ schemaOptions: { collection: "mails", timestamps: { createdAt: "created_at" } } })
export class MailEvent extends Base {
  @prop({ required: true })
  public templateName!: string;

  @prop({ required: true })
  public email!: string;

  @prop()
  public langue?: string;

  @prop({ ref: "User" })
  public userId?: Ref<User>;

  @prop({ ref: () => Dispositif })
  public dispositifId?: Ref<Dispositif>;
}
