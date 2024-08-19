import { DocumentType, isDocumentArray, modelOptions, prop, Ref } from "@typegoose/typegoose";
import passwordHash from "password-hash";
import jwt from "jwt-simple";

import { Dispositif } from "./Dispositif";
import { ImageSchema } from "./generics";
import { Langue } from "./Langue";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { Base } from "./Base";
import { RoleName, UserStatus } from "@refugies-info/api-types";

export class Favorite {
  @prop({ ref: () => Dispositif })
  public dispositifId: Ref<Dispositif>;
  @prop()
  public created_at: Date;
}

@modelOptions({ schemaOptions: { collection: "users", timestamps: { createdAt: "created_at" } } })
export class User extends Base {
  @prop({ lowercase: true, trim: true })
  public username?: string;

  @prop()
  public password: string;

  @prop({ unique: true, required: true, lowercase: true, trim: true })
  public email!: string;

  @prop({ trim: true })
  public firstName?: string;

  @prop()
  public phone?: string;

  @prop()
  public description: string;

  @prop({ _id: false })
  public picture?: ImageSchema;

  @prop({ ref: () => Role })
  public roles?: Ref<Role>[];

  @prop({ ref: () => Langue })
  public selectedLanguages?: Ref<Langue>[];

  // FIXME jointure ?
  @prop({ ref: () => Dispositif })
  public contributions?: Ref<Dispositif>[];

  @prop({ enum: UserStatus })
  public status?: UserStatus;

  @prop()
  public favorites?: Favorite[];

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
  public adminComments?: string;

  @prop()
  public partner?: string;

  @prop()
  public departments?: string[];

  @prop()
  public created_at?: Date;

  @prop()
  public mfaCode?: string;

  public authenticate(this: DocumentType<User>, password: string) {
    return passwordHash.verify(password, this.password.toString());
  }

  public getToken(this: DocumentType<User>) {
    if (!process.env.SECRET) throw new Error("You need to setup à SECRET envvar for jwt");
    return jwt.encode(
      {
        _id: this._id,
        username: this.username,
        password: this.password,
        email: this.email,
      },
      process.env.SECRET,
    );
  }

  public hasRole(roleName: RoleName): boolean {
    return isDocumentArray(this.roles) && this.roles.some((role: Role) => role.nom === roleName);
  }

  public isAdmin(): boolean {
    return this.hasRole(RoleName.ADMIN);
  }

  public isExpert(): boolean {
    return this.hasRole(RoleName.EXPERT_TRAD);
  }

  /**
   * Retourne les rôles Admin et ExpertTrad si ils existent dans la liste
   *
   * @param roles
   * @returns roles
   */
  public getPlateformeRoles(): RoleName[] {
    if (!isDocumentArray(this.roles)) {
      throw new Error("roles must be populated");
    }

    return this.roles && this.roles.length > 0
      ? this.roles
        .filter((role) => role.nom === RoleName.ADMIN || role.nom === RoleName.EXPERT_TRAD)
        .map((role) => role.nom)
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
