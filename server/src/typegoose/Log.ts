import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";
import { Langue } from "./Langue";
import { Structure } from "./Structure";
import { User } from "./User";

class LogLink {
  @prop({ refPath: "model_link" })
  public id: Ref<User | Dispositif | Structure>;

  @prop({ enum: ["User", "Dispositif", "Structure"] })
  public model_link: "User" | "Dispositif" | "Structure";

  @prop({ type: String })
  public next:
    | "ModalContenu"
    | "ModalStructure"
    | "ModalUser"
    | "ModalReaction"
    | "ModalImprovements"
    | "ModalNeeds"
    | "PageAnnuaire";
}

@modelOptions({ schemaOptions: { collection: "logs", timestamps: { createdAt: "created_at" } } })
export class Log extends Base {
  @prop()
  created_at: Date;

  @prop({ required: true, refPath: "model_object" })
  public objectId!: Ref<User | Dispositif | Structure>;

  @prop({ required: true, enum: ["User", "Dispositif", "Structure"] })
  public model_object!: "User" | "Dispositif" | "Structure";

  @prop({ required: true })
  public text!: string;

  @prop({ ref: () => User })
  public author?: Ref<User>;

  // used to replace {{dynamic}} in text by object property
  @prop({ refPath: "model_dynamic" })
  public dynamicId?: Ref<User | Dispositif | Structure | Langue>;

  @prop({
    type: () => String,
    required: function () {
      return !!this.dynamicId;
    }
  })
  public model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";

  @prop({ type: () => LogLink })
  public link?: LogLink;
}

export type LogId = Log["_id"];
