const mongoose = require("mongoose");

const TimCardPermissionSchema = new mongoose.Schema(
  {
    card: {
      type: mongoose.Types.ObjectId,
      ref: "TimCard",
    },
    door: {
      type: String,
      enum: ["Oda1", "Oda2", "Oda3", "Akademi", "main-door"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TimCardPermission", TimCardPermissionSchema);
