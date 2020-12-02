import mongoose, { ObjectId } from "mongoose";

var audioSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    resource_type: {
      type: String,
      required: false,
    },
    bytes: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    etag: {
      type: String,
      required: false,
    },
    original_filename: {
      type: String,
      required: false,
    },
    secure_url: {
      type: String,
      required: false,
    },
    signature: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    version: {
      type: String,
      required: false,
    },
  },
  // @ts-ignore : https://github.com/Automattic/mongoose/issues/9606
  { timestamps: { createdAt: "created_at" } }
);

export interface AudioDoc extends mongoose.Document {
  _id: ObjectId;
  public_id: string;
  resource_type?: string;
  bytes?: number;

  type?: string;

  etag?: string;

  original_filename?: string;

  secure_url?: string;

  signature?: string;

  url: string;

  version?: string;
}

export const Audio = mongoose.model<AudioDoc>("Audio", audioSchema);
