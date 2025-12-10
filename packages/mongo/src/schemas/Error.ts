import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import type { UserId } from "./User";

// Error Schema
export const ErrorSchema = z.object({
  name: z.string(),
  userId: z.custom<UserId>().optional(),
  dataObject: z.record(z.unknown()),
  error: z.record(z.unknown()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ErrorType = z.infer<typeof ErrorSchema> & { _id: Types.ObjectId };
export type ErrorId = Types.ObjectId | string;

export interface Error extends Omit<ErrorType, "userId"> {
  userId?: UserId;
}

export const ErrorMongooseSchema = new Schema<Error>(
  {
    name: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    dataObject: { type: Object },
    error: { type: Object },
  },
  {
    collection: "errors",
    timestamps: true,
  },
);

export const ErrorModel = model<Error>("Error", ErrorMongooseSchema);
