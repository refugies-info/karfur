import mongoose, { ObjectId, Schema } from "mongoose";
import { Moment } from "moment";

const adminOptionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface AdminOptionDoc extends mongoose.Document {
  _id: ObjectId;
  key: string;
  value: any;
  created_at: Moment;
}

export const AdminOption = mongoose.model<AdminOptionDoc>("AdminOptions", adminOptionSchema);
