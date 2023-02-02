import { DocumentType, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import passwordHash from "password-hash";
import jwt from "jwt-simple";

import { Dispositif } from "./Dispositif";
import { ImageSchema } from "./generics";
import { Langue } from "./Langue";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { Types } from "mongoose";

let config: { secret?: string } = {};
if (process.env.NODE_ENV === "dev") {
  config = require("../config/config");
}

export const USER_STATUS_ACTIVE = "Actif";
export const USER_STATUS_DELETED = "Exclu";
type UserStatus = typeof USER_STATUS_ACTIVE | typeof USER_STATUS_DELETED;

@modelOptions({ schemaOptions: { timestamps: { createdAt: "created_at" } } })
export class User implements Base<Types.ObjectId> {
  @prop()
  public _id: Types.ObjectId;

  @prop()
  public id: string;

  @prop({ unique: true, required: true, lowercase: true, trim: true })
  public username!: String;

  @prop({ required: true })
  public password!: String;

  @prop({ lowercase: true, trim: true })
  public email?: String;

  @prop()
  public phone?: String;

  @prop()
  public description: String;

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
  public structures: Ref<Structure>[];

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
}
