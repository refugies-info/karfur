import { Types } from "mongoose";

export abstract class Base {
  constructor() {}

  public _id?: Types.ObjectId;
  public id?: string;
}
