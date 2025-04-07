import { RoleName } from "@refugies-info/api-types";
import { modelOptions, prop } from "@typegoose/typegoose";
import { Base } from "./Base";

@modelOptions({ schemaOptions: { collection: "roles", timestamps: { createdAt: "created_at" } } })
export class Role extends Base {
  @prop({ required: true, unique: true, enum: Object.values(RoleName), type: String })
  public nom!: RoleName;

  @prop()
  public nomPublique?: string;
}
