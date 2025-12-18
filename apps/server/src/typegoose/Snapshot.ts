import { DispositifStatus } from "@refugies-info/api-types";
import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { type DemarcheContent, Dispositif, type DispositifContent } from "./Dispositif";

export type SnapshotType = "before" | "after";

@modelOptions({
  schemaOptions: { collection: "snapshots", timestamps: { createdAt: "created_at" } },
})
export class Snapshot extends Base {
  @prop({ required: true, ref: () => Dispositif })
  public dispositifId!: Ref<Dispositif>;

  @prop({ required: true, min: 1 })
  public version!: number;

  @prop()
  created_at: Date;

  @prop({ required: true, enum: ["before", "after"] })
  public type!: SnapshotType;

  @prop({ required: true, enum: Object.values(DispositifStatus), type: String })
  public from!: DispositifStatus;

  @prop({ required: true, enum: Object.values(DispositifStatus), type: String })
  public to!: DispositifStatus;

  @prop({ required: true, type: Object })
  public data!: DispositifContent | DemarcheContent;
}
