import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

const mailEventSchema = new mongoose.Schema(
  {
    templateName: {
      type: String,
      unique: false,
      required: true,
    },
    email: {
      type: String,
      unique: false,
      required: true,
    },
    username: {
      type: String,
      unique: false,
      required: true,
    },
    langue: {
      type: String,
      unique: false,
      required: true,
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    dispositifId: { type: mongoose.Types.ObjectId, ref: "Dispositif" },
  },
  // @ts-ignore : https://github.com/Automattic/mongoose/issues/9606
  { timestamps: { createdAt: "created_at" } }
);

export interface MailEventDoc extends mongoose.Document {
  _id: ObjectId;
  templateName: string;
  email: string;
  username: string;
  created_at: Moment;
  langue?: string;
}
export const MailEvent = mongoose.model<MailEventDoc>("Mail", mailEventSchema);
