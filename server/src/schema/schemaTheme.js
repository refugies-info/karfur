const mongoose = require("mongoose");

var themeSchema = mongoose.Schema(
  {
    themeNom: {
      type: String,
      unique: true,
      required: true,
    },
    themeDescription: {
      type: String,
      unique: false,
      required: false,
    },
    themeIsUnder: {
      type: Boolean,
      unique: false,
      required: false,
    },
    themeUnderId: {
      type: String,
      unique: false,
      required: false,
    },
    status: {
      type: String,
      unique: false,
      required: false,
    },
    avancement: {
      type: Number,
      unique: false,
      required: false,
    },
    participants: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
      required: false,
    },
    articles: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Article" }],
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Theme", themeSchema);
