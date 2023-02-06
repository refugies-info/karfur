import { isDocumentArray, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { MustBePopulatedError } from "src/errors";
import { Base } from "./Base";
import { Dispositif } from "./Dispositif";
import { ImageSchema } from "./generics";
import { User, UserId } from "./User";

export class Membre {
  @prop({ required: true })
  public userId!: Ref<User, UserId>;
  @prop({ required: true, type: () => [String] })
  public roles!: String[];
  @prop({ required: true })
  public added_at!: Date;
}

class DetailedOpeningHours {
  @prop({ required: true })
  public day!: String;
  @prop()
  public from0?: String;
  @prop()
  public to0?: String;
  @prop()
  public from1?: String;
  @prop()
  public to1?: String;
}

class OpeningHours {
  @prop({ required: true, type: () => [DetailedOpeningHours] })
  public details!: DetailedOpeningHours[];
  @prop({ required: true })
  public noPublic!: Boolean;
  @prop()
  public precisions?: String;
}

@modelOptions({ schemaOptions: { collection: "structures", timestamps: { createdAt: "created_at" } } })
export class Structure extends Base {
  @prop({ type: () => [Membre] })
  public membres?: Membre[];

  @prop()
  public acronyme?: string;
  @prop({ required: true, ref: () => User })
  public administrateur!: Ref<User>;
  @prop()
  public adresse?: String;
  @prop()
  public authorBelongs?: Boolean;
  @prop()
  public contact?: String;
  @prop({ required: true, ref: () => User })
  public createur!: Ref<User>;
  @prop({ ref: () => Dispositif })
  public dispositifsAssocies?: Ref<Dispositif>[];
  @prop()
  public link?: String;
  @prop()
  public mail_contact?: String;
  @prop()
  public mail_generique?: String;
  @prop({ required: true })
  public nom!: string;
  @prop()
  public phone_contact?: String;
  @prop()
  public siren?: String;
  @prop()
  public siret?: String;
  // FIXME typage => Actif | En attente | Supprimé [| ...]
  @prop()
  public status?: String;
  @prop({ type: () => ImageSchema })
  public picture?: ImageSchema;
  @prop({ default: [], type: () => [String] })
  public structureTypes?: String[];
  @prop({ default: [], type: () => [String] })
  public websites?: String[];
  @prop()
  public facebook?: String;
  @prop()
  public linkedin?: String;
  @prop()
  public twitter?: String;
  @prop({ default: [], type: () => [String] })
  public activities?: String[];
  @prop({ default: [], type: () => [String] })
  public departments?: String[];
  @prop({ default: [], type: () => [String] })
  public phonesPublic?: String[];
  @prop({ default: [], type: () => [String] })
  public mailsPublic?: String[];
  @prop()
  public adressPublic?: String;
  @prop({ type: () => OpeningHours })
  public openingHours?: OpeningHours;
  @prop()
  public onlyWithRdv?: Boolean;
  @prop()
  public description?: String;
  @prop()
  public hasResponsibleSeenNotification?: Boolean;
  @prop({ type: () => [String] })
  public disposAssociesLocalisation?: String[];
  @prop()
  public adminComments?: String;
  @prop()
  public adminProgressionStatus?: String;
  @prop()
  public adminPercentageProgressionStatus: String;

  public getDispositifsAssocies(): Dispositif[] {
    if (!this.dispositifsAssocies) return [];
    if (!isDocumentArray(this.dispositifsAssocies)) {
      throw new MustBePopulatedError("dispositifsAssocies");
    }
    return this.dispositifsAssocies;
  }
}

export type StructureId = Structure["_id"] | Structure["id"];
