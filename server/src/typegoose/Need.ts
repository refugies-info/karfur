import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { isInteger } from "lodash";
import { Base } from "./Base";
import { Theme, ThemeId } from "./Theme";

export class NeedTranslation {
  @prop()
  public text: string;
  @prop()
  public subtitle: string;
  @prop()
  public updatedAt?: Date;
}

@modelOptions({ schemaOptions: { collection: "needs", timestamps: { createdAt: "created_at" } } })
export class Need extends Base {
  @prop()
  public tagName?: string;

  @prop({ ref: () => Theme })
  public theme!: Ref<Theme, ThemeId>;

  @prop()
  adminComments?: string;

  @prop({ default: 0 })
  public nbVues!: number;

  @prop({
    type: Number,
    validate: { validator: (v: any) => isInteger(v) && v >= 0, message: "position must be an positive integer" }
  })
  public position?: number;

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

export type NeedId = Need["_id"] | Need["id"];
