import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: { createdAt: "created_at" } } })
export class Role {
  @prop({ required: true, trim: true, unique: true })
  public nom!: String;

  @prop()
  public nomPublic?: String;
}
