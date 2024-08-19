import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { ContentType } from "@refugies-info/api-types";
import { Base } from "./Base";
import { Theme } from "./Theme";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "widgets", timestamps: { createdAt: "created_at" } } })
export class Widget extends Base {
  @prop()
  created_at: Date;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, type: () => [String] })
  public tags!: string[];

  @prop({ required: true, ref: () => Theme })
  public themes!: Ref<Theme>[];

  @prop({ required: true })
  public typeContenu: ContentType[];

  @prop()
  public department: string;

  @prop({ type: () => [String] })
  public languages: string[];

  @prop({ required: true })
  public author!: Ref<User>;
}

export type WidgetId = Widget["_id"] | Widget["id"];
