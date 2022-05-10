import mongoose, { ObjectId } from "mongoose";
import { Moment } from "moment";

const logSchema = new mongoose.Schema(
  {
    objectId: {
      type: mongoose.Types.ObjectId,
      refPath: "model_object",
      required: true
    },
    model_object: {
      type: String,
      enum: ["User", "Dispositif", "Structure"],
      required: true
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false
    },
    dynamicId: { // used to replace {{dynamic}} in text by object property
      type: mongoose.Types.ObjectId,
      refPath: "model_dynamic",
      required: false
    },
    model_dynamic: {
      type: String,
      enum: ["User", "Dispositif", "Structure", "Langue"],
      required: function () { return !!this.dynamicId }
    },
    link: {
      id: {
        type: mongoose.Types.ObjectId,
        refPath: "model_link"
      },
      model_link: {
        type: String,
        enum: ["User", "Dispositif", "Structure"],
        required: function () { return !!this.link.id }
      },
      next: {
        type: String,
        enum: ["ModalContenu", "ModalStructure", "ModalUser", "ModalReaction", "ModalImprovements", "ModalNeeds", "PageAnnuaire"],
        required: false
      },
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

export interface LogDoc extends mongoose.Document {
  _id: ObjectId;
  objectId: ObjectId;
  model_object: "User" | "Dispositif" | "Structure";
  text: string;
  author?: ObjectId;
  dynamicId?: ObjectId;
  model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";
  link?: {
    id: ObjectId;
    model_link: "User" | "Dispositif" | "Structure";
    next: "ModalContenu" | "ModalStructure" | "ModalUser" | "ModalReaction" | "ModalImprovements" | "ModalNeeds" | "PageAnnuaire";
  }
  created_at: Moment;
}

export const Log = mongoose.model<LogDoc>("Logs", logSchema);
