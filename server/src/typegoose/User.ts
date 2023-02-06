import { DocumentType, isDocumentArray, modelOptions, prop, Ref } from "@typegoose/typegoose";
import passwordHash from "password-hash";
import jwt from "jwt-simple";

import { Dispositif } from "./Dispositif";
import { ImageSchema } from "./generics";
import { Langue } from "./Langue";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { Base } from "./Base";

let config: { secret?: string } = {};
if (process.env.NODE_ENV === "dev") {
  config = require("../config/config");
}

export const USER_STATUS_ACTIVE = "Actif";
export const USER_STATUS_DELETED = "Exclu";
type UserStatus = typeof USER_STATUS_ACTIVE | typeof USER_STATUS_DELETED;

@modelOptions({ schemaOptions: { collection: "users", timestamps: { createdAt: "created_at" } } })
export class User extends Base {
  @prop({ unique: true, required: true, lowercase: true, trim: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ lowercase: true, trim: true })
  public email?: string;

  @prop()
  public phone?: string;

  @prop()
  public description: string;

  @prop()
  public picture?: ImageSchema;

  @prop({ ref: () => Role })
  public roles?: Ref<Role>[];

  @prop({ ref: () => Langue })
  public selectedLanguages?: Ref<Langue>[];

  // FIXME Faire une jointure si toujours nécessaire
  // @prop({ ref: () => Traductions })
  // public traductionsFaites: Ref<Traductions>[];

  // FIXME jointure ?
  @prop({ ref: () => Dispositif })
  public contributions?: Ref<Dispositif>[];

  // FIXME toujours utilisé ?
  //   @prop()
  //   public noteTraduction: {
  //     type: Number,
  //     required: false,
  //   },

  // FIXME typage
  @prop({ type: String })
  public status?: UserStatus;

  // TODO Revoir cette propriété !
  // parkourData ?
  // dispositifsPinned ? (contient une copie du dispo !!)
  @prop()
  public cookies?: Object;

  @prop({ ref: () => Structure })
  public structures?: Ref<Structure>[];

  @prop()
  public last_connected?: Date;

  @prop()
  public authy_id?: String;

  @prop()
  public reset_password_token?: String;

  @prop()
  public reset_password_expires?: Date;

  @prop()
  public adminComments?: String;

  @prop()
  public created_at?: Date;

  public authenticate(this: DocumentType<User>, password: string) {
    return passwordHash.verify(password, this.password.toString());
  }

  public getToken(this: DocumentType<User>) {
    return jwt.encode(
      {
        _id: this._id,
        username: this.username,
        password: this.password,
        email: this.email
      },

      process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET
    );
  }

  public hasRole(roleName: string): boolean {
    return isDocumentArray(this.roles) && this.roles.some((role: Role) => role.nom === roleName);
  }

  /**
   * Retourne les rôles Admin et ExpertTrad si ils existent dans la liste
   *
   * @param roles
   * @returns roles
   */
  public getPlateformeRoles(): string[] {
    if (!isDocumentArray(this.roles)) {
      throw new Error("roles must be populated");
    }

    return this.roles && this.roles.length > 0
      ? this.roles
          .filter((role) => role.nom === "Admin" || role.nom === "ExpertTrad")
          .map((role) => role.nom.toString())
      : [];
  }

  /**
   * Retourne les structures si elles ont été "populated"
   * @returns structures
   */
  public getStructures(): Structure[] {
    if (!this.structures) return [];

    if (!isDocumentArray(this.structures)) {
      throw new Error("structures must be populated");
    }

    return this.structures;
  }

  /**
   * Retourne les langues sélectionnées si elles ont été "populated"
   * @returns structures
   */
  public getSelectedLanguages(): Langue[] {
    if (!this.selectedLanguages) return [];

    if (!isDocumentArray(this.selectedLanguages)) {
      throw new Error("selectedLanguages must be populated");
    }

    return this.selectedLanguages;
  }

  public getSelectedLanguagesButFrench(): Langue[] {
    return isDocumentArray(this.selectedLanguages)
      ? this.selectedLanguages.filter((language) => language.langueCode !== "fr")
      : [];
  }
}

export type UserId = User["_id"] | User["id"];
