import { Types } from "mongoose";

export abstract class Base {
  public _id?: Types.ObjectId;
  public id?: string;
}
