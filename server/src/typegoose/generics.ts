import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class ImageSchema {
  @prop()
  secure_url!: string;

  @prop()
  public_id!: string;

  @prop()
  imgId!: string;
}

export type RichText = string;
export type Uuid = string;

export type Languages = "fr" | "en" | "uk" | "ti" | "ar" | "ps" | "ru";

// export class Id<TypeId, ToId extends Types.ObjectId = Types.ObjectId> {
//   private objectId: ToId;
//   constructor(id: TypeId) {
//     this.objectId = id instanceof TypeId ? id : new ToId(logId);
//   }

//   toString(): string {
//     return this.objectId.toString();
//   }

//   get(): ToId {
//     return this.objectId;
//   }

//   public static toId<ToId extends Types.ObjectId = Types.ObjectId>(id: any): ToId {
//     return new this<any, ToId>(id).get();
//   }
// }

export class Id extends Types.ObjectId { }
