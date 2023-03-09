import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "images", timestamps: { createdAt: "created_at" } } })
export class Image {
  @prop({ trim: true, unique: true, required: true })
  public public_id!: String;

  @prop()
  public format: String;

  @prop()
  public height: Number;

  @prop()
  public width: Number;

  @prop()
  public original_filename: String;

  @prop()
  public secure_url: String;

  @prop()
  public signature: String;

  @prop()
  public url: String;

  @prop()
  public version: String;
}
