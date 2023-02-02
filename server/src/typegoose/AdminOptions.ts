import { modelOptions, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: { createdAt: "created_at" }, collection: "AdminOptions" } })
export class AdminOptions {
  @prop({ required: true, unique: true })
  public key!: String;

  @prop({ required: true, type: Schema.Types.Mixed })
  public value!: any;
}
