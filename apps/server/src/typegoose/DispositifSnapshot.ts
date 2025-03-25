import { prop, Ref } from "@typegoose/typegoose";
import { Dispositif } from "./Dispositif";

export class DispositifSnapshot {
  @prop({ required: true, ref: () => Dispositif })
  public dispositifId!: Ref<Dispositif>;

  @prop({ required: true, min: 1 })
  public version!: number;

  @prop({ required: true, default: Date.now })
  public createdAt!: Date;

  @prop({ required: true, enum: ["before", "after"] })
  public snapshotType!: "before" | "after";

  @prop()
  public transitionFrom?: string;

  @prop()
  public transitionTo?: string;

  @prop({ required: true, type: Object })
  public dispositifData!: Record<string, any>;
}
