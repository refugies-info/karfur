import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "images", timestamps: { createdAt: "created_at" } } })
export class Image {
  @prop({ trim: true, unique: true, required: true })
  public public_id!: string;

  @prop()
  public format: string;

  @prop()
  public height: number;

  @prop()
  public width: number;

  @prop()
  public original_filename: string;

  @prop()
  public secure_url: string;

  @prop()
  public signature: string;

  @prop()
  public url: string;

  @prop()
  public version: string;
}
