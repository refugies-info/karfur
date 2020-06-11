const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const jwt = require("jwt-simple");
let config = {};
if (process.env.NODE_ENV === "dev") {
  config = require("../config/config");
}

var userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: false,
      required: false,
    },
    phone: {
      type: String,
      unique: false,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    objectifTemps: {
      type: Number,
      required: false,
    },
    objectifMots: {
      type: Number,
      required: false,
    },
    notifyObjectifs: {
      type: Boolean,
      required: false,
    },
    objectifTempsContrib: {
      type: Number,
      required: false,
    },
    objectifMotsContrib: {
      type: Number,
      required: false,
    },
    notifyObjectifsContrib: {
      type: Boolean,
      required: false,
    },
    picture: {
      type: Object,
      required: false,
    },
    roles: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Role" }],
      required: false,
    },
    selectedLanguages: {
      type: Array,
      required: false,
    },
    traductionsFaites: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Traduction" }],
      required: false,
    },
    contributions: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Dispositif" }],
      required: false,
    },
    noteTraduction: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    cookies: {
      type: Object,
      required: false,
    },
    structures: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Structure" }],
      required: false,
    },
    last_connected: {
      type: Date,
      required: false,
    },
    authy_id: {
      type: String,
      required: false,
    },
    reset_password_token: {
      type: String,
      required: false,
    },
    reset_password_expires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

userSchema.methods = {
  authenticate: function (password) {
    return passwordHash.verify(password, this.password);
  },
  getToken: function () {
    return jwt.encode(
      {
        _id: this._id,
        username: this.username,
        password: this.password,
        email: this.email,
      },
      process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET
    );
  },
};

module.exports = mongoose.model("User", userSchema);
