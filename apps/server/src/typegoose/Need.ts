import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { isInteger } from "lodash";
import { Base } from "./Base";
import type { ImageSchema } from "./generics";
import { Theme, type ThemeId } from "./Theme";

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
    validate: {
      validator: (v: unknown) => isInteger(v) && Number(v) >= 0,
      message: "position must be an positive integer",
    },
  })
  public position?: number;

  @prop({ _id: false })
  public image: ImageSchema;

  /**
   * Translations
   */
  @prop({ _id: false })
  public fr!: NeedTranslation;
  @prop({ _id: false })
  public ar!: NeedTranslation;
  @prop({ _id: false })
  public en!: NeedTranslation;
  @prop({ _id: false })
  public ru!: NeedTranslation;
  @prop({ _id: false })
  public fa!: NeedTranslation;
  @prop({ _id: false })
  public ti!: NeedTranslation;
  @prop({ _id: false })
  public ps!: NeedTranslation;
  @prop({ _id: false })
  public uk!: NeedTranslation;
}

export type NeedId = Need["_id"] | Need["id"];
