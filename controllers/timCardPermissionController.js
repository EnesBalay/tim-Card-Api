const TimCard = require("../models/TimCard");
const TimCardPermission = require("../models/TimCardPermission");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  PositiveResponse,
  NegativeResponse,
  NotValidResponse,
} = require("../utils/responses.js");

const createTimCardPermission = async (req, res) => {
  try {
    const { cardId, startDate, endDate, door } = req.params;
    const timCardPermission = new TimCardPermission(
      cardId,
      startDate,
      endDate,
      door
    );
    res.status(StatusCodes.OK).json({ timCardPermission });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Bir hata oluştu!" });
  }
};

module.exports = {
  createTimCardPermission,
};
