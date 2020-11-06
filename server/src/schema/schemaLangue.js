const mongoose = require("mongoose");

var langueSchema = mongoose.Schema(
  {
    langueFr: {
      type: String,
      unique: true,
      required: true,
    },
    langueLoc: {
      type: String,
      unique: false,
      required: false,
    },
    langueCode: {
      type: String,
      unique: false,
      required: false,
    },
    langueIsDialect: {
      type: Boolean,
      unique: false,
      required: false,
    },
    langueBackupId: { type: mongoose.Schema.ObjectId, ref: "Langue" },
    status: {
      type: String,
      unique: false,
      required: false,
    },
    i18nCode: {
      type: String,
      unique: true,
      required: true,
    },
    avancement: {
      type: Number,
      unique: false,
      required: false,
    },
    avancementTrad: {
      type: Number,
      unique: false,
      required: false,
    },
    participants: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Langue", langueSchema);
