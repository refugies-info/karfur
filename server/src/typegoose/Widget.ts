import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Theme } from "./Theme";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "widgets", timestamps: { createdAt: "created_at" } } })
export class Widget extends Base {
  @prop({ required: true })
  public name!: String;

  @prop({ required: true, type: () => [String] })
  public tags!: String[];

  @prop({ required: true, ref: () => Theme })
  public themes!: Ref<Theme>[];

  @prop({ required: true })
  public typeContenu: ("dispositif" | "demarche")[];

  @prop()
  public department: String;

  @prop({ type: () => [String] })
  public languages: String[];

  @prop({ required: true })
  public author!: Ref<User>;
}

export type WidgetId = Widget["_id"] | Widget["id"];
