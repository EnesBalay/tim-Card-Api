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
    const { card, startDate, endDate, door } = req.body;
    const timCardPermission = await TimCardPermission.create({
      card,
      startDate,
      endDate,
      door,
    });
    res.status(StatusCodes.OK).json({ timCardPermission });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Bir hata oluştu!", error: error.message });
  }
};

const getAllTimCardPermissions = async (req, res) => {
  try {
    const timCardPermissions = await TimCardPermission.find({}).populate({
      path: "card",
      select: "cardId name",
    });
    res.status(StatusCodes.OK).json({ timCardPermissions });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Bir hata oluştu!", error: error.message });
  }
};

const getSingleTimCardPermission = async (req, res) => {
  try {
    const timCardPermission = await TimCardPermission.findById(
      req.params.id
    ).populate({
      path: "card",
      select: "cardId name",
    });

    res.status(StatusCodes.OK).json({ timCardPermission });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Bir hata oluştu!", error: error });
  }
};

const deleteTimCardPermission = async (req, res) => {
  const timCardPermission = await TimCardPermission.findById(req.params.id);
  if (!timCardPermission) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Böyle bir yetki bulunamadı!" });
  }
  try {
    timCardPermission.deleteOne();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Yetki başarılı bir şekilde silindi!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Bir hata oluştu!", error: error });
  }
};

const checkTimCardPermission = async (req, res) => {
  try {
    const { card, door } = req.params;
    const timCard = await TimCard.findOne({ cardId: card });

    if (timCard) {
      const timCardPermissions = await TimCardPermission.find({
        card: timCard._id,
        door: door,
      });

      let serverDate = new Date();
      serverDate.setUTCHours(serverDate.getUTCHours() + 3);

      timCardPermissions.forEach((element) => {
        const startDate = new Date(element.startDate);
        const endDate = new Date(element.endDate);
        if (serverDate >= startDate && serverDate <= endDate) {
          console.log("asd");
          res.status(StatusCodes.OK).json(PositiveResponse);
        }
      });
    }
    res.status(StatusCodes.UNAUTHORIZED).json(NegativeResponse);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(NegativeResponse);
  }
};

module.exports = {
  createTimCardPermission,
  deleteTimCardPermission,
  getAllTimCardPermissions,
  getSingleTimCardPermission,
  checkTimCardPermission,
};
