const mongoose = require("mongoose");

const TimCardSchema = new mongoose.Schema(
  {
    cardId: {
      type: String,
      unique: true,
      required: [true, "Kard Id Zorunlu"],
    },
    nameSurname: {
      type: String,
    },
    teskilat: {
      type: String,
    },
    mission: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TimCard", TimCardSchema);
