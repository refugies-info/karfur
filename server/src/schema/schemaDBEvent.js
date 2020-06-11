const mongoose = require("mongoose");

var dbEventSchema = mongoose.Schema(
  {
    api: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    roles: {
      type: Object,
      required: false,
    },
    action: {
      type: Object,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("DBEvent", dbEventSchema);
