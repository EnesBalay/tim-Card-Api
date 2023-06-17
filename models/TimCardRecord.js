const mongoose = require("mongoose");

const TimCardRecordSchema = new mongoose.Schema(
  {
    card: {
      type: mongoose.Types.ObjectId,
      ref: "TimCard",
    },
    cardId: String,
    door: {
      type: String,
      enum: ["Oda1", "Oda2", "Oda3", "Akademi","main-door"],
    },
    state: {
      type: String,
      enum: ["Kapalı", "Açık"],
    },
    Akademi1: Boolean,
    Akademi2: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TimCardRecord", TimCardRecordSchema);
