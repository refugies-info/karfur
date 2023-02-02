import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { isInteger } from "lodash";
import { Theme } from "./Theme";

export interface NeedTranslation {
  text: String;
  subtitle: String;
  updatedAt: Date;
}

@modelOptions({ schemaOptions: { timestamps: { createdAt: "created_at" } } })
export class Need {
  @prop()
  public tagName?: String;

  @prop({ ref: () => Theme })
  public theme!: Ref<Theme>;

  @prop()
  adminComments?: String;

  @prop({ default: 0 })
  public nbVues!: Number;

  @prop({
    type: Number,
    validate: { validator: (v: any) => isInteger(v) && v >= 0, message: "position must be an positive integer" }
  })
  public position?: Number;

  // FIXME : is this used anymore ? no record in DB
  //   @prop()
  //   public image: imageSchema;

  /**
   * Translations
   */
  @prop()
  public fr!: NeedTranslation;
  @prop()
  public ar!: NeedTranslation;
  @prop()
  public en!: NeedTranslation;
  @prop()
  public ru!: NeedTranslation;
  @prop()
  public fa!: NeedTranslation;
  @prop()
  public ti!: NeedTranslation;
  @prop()
  public ps!: NeedTranslation;
  @prop()
  public uk!: NeedTranslation;
}
