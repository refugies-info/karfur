import { modelOptions, prop } from "@typegoose/typegoose";
import { Base } from "./Base";

@modelOptions({ schemaOptions: { collection: "roles", timestamps: { createdAt: "created_at" } } })
export class Role extends Base {
  @prop({ required: true, trim: true, unique: true })
  public nom!: String;

  @prop()
  public nomPublic?: String;
}
