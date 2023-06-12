import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { StructureStatus } from "@refugies-info/api-types";
import { Base } from "./Base";
import { ImageSchema } from "./generics";
import { User, UserId } from "./User";

export class Membre {
  @prop({ required: true })
  public userId!: Ref<User, UserId>;
  @prop({ required: true, type: () => [String] })
  public roles!: string[];
  @prop({ required: true })
  public added_at!: Date;
}

class DetailedOpeningHours {
  @prop({ required: true })
  public day!: string;
  @prop()
  public from0?: string;
  @prop()
  public to0?: string;
  @prop()
  public from1?: string;
  @prop()
  public to1?: string;
}

class OpeningHours {
  @prop({ required: true, type: () => [DetailedOpeningHours], _id: false })
  public details!: DetailedOpeningHours[];
  @prop()
  public noPublic?: boolean;
  @prop()
  public precisions?: string;
}

@modelOptions({ schemaOptions: { collection: "structures", timestamps: { createdAt: "created_at" } } })
export class Structure extends Base {
  @prop({ type: () => [Membre], _id: false })
  public membres?: Membre[];

  @prop()
  public acronyme?: string;
  @prop({ ref: () => User })
  public administrateur?: Ref<User>;
  @prop()
  public adresse?: string;
  @prop()
  public authorBelongs?: boolean;
  @prop()
  public contact?: string;
  @prop({ required: true, ref: () => User })
  public createur!: Ref<User>;
  @prop()
  public link?: string;
  @prop()
  public mail_contact?: string;
  @prop()
  public mail_generique?: string;
  @prop({ required: true })
  public nom!: string;
  @prop()
  public phone_contact?: string;
  @prop()
  public siren?: string;
  @prop()
  public siret?: string;
  @prop({ enum: StructureStatus })
  public status?: StructureStatus;
  @prop({ type: () => ImageSchema, _id: false })
  public picture?: ImageSchema;
  @prop({ default: [], type: () => [String] })
  public structureTypes?: string[];
  @prop({ default: [], type: () => [String] })
  public websites?: string[];
  @prop()
  public facebook?: string;
  @prop()
  public linkedin?: string;
  @prop()
  public twitter?: string;
  @prop({ default: [], type: () => [String] })
  public activities?: string[];
  @prop({ default: [], type: () => [String] })
  public departments?: string[];
  @prop({ default: [], type: () => [String] })
  public phonesPublic?: string[];
  @prop({ default: [], type: () => [String] })
  public mailsPublic?: string[];
  @prop()
  public adressPublic?: string;
  @prop({ type: () => OpeningHours, _id: false })
  public openingHours?: OpeningHours;
  @prop()
  public onlyWithRdv?: boolean;
  @prop()
  public description?: string;
  @prop()
  public hasResponsibleSeenNotification?: boolean;
  @prop({ type: () => [String] }) // TODO: remove?
  public disposAssociesLocalisation?: string[];
  @prop()
  public adminComments?: string;
  @prop()
  public adminProgressionStatus?: string;
  @prop()
  public adminPercentageProgressionStatus: string;
}

export type StructureId = Structure["_id"] | Structure["id"];
