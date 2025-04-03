import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";

@modelOptions({ schemaOptions: { collection: "snapshots", timestamps: { createdAt: "created_at" } } })
export class Snapshot extends Base {
  @prop({ required: true, ref: () => Dispositif })
  public dispositifId!: Ref<Dispositif>;

  @prop({ required: true, min: 1 })
  public version!: number;

  @prop()
  created_at: Date;

  @prop({ required: true, enum: ["before", "after"] })
  public snapshotType!: "before" | "after";

  @prop()
  public transitionFrom?: string;

  @prop()
  public transitionTo?: string;

  @prop({ required: true, type: Object })
  public dispositifData!: Record<string, any>;
}
