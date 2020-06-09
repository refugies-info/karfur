const mongoose = require("mongoose");

var structureSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      unique: false,
      required: true,
    },
    acronyme: {
      type: String,
      unique: false,
      required: false,
    },
    link: {
      type: String,
      unique: false,
      required: false,
    },
    contact: {
      type: String,
      unique: false,
      required: false,
    },
    mail_contact: {
      type: String,
      unique: false,
      required: false,
    },
    phone_contact: {
      type: String,
      unique: false,
      required: false,
    },
    picture: {
      type: Object,
      unique: false,
      required: false,
    },
    siren: {
      type: String,
      unique: false,
      required: false,
    },
    siret: {
      type: String,
      unique: false,
      required: false,
    },
    adresse: {
      type: Object,
      unique: false,
      required: false,
    },
    mail_generique: {
      type: Object,
      unique: false,
      required: false,
    },
    authorBelongs: {
      type: Boolean,
      unique: false,
      required: false,
    },
    status: {
      type: String,
      unique: false,
      required: false,
    },
    dispositifsAssocies: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Dispositif" }],
      required: false,
    },
    createur: { type: mongoose.Schema.ObjectId, ref: "User" },
    administrateur: { type: mongoose.Schema.ObjectId, ref: "User" },
    membres: {
      type: Object,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Structure", structureSchema);
