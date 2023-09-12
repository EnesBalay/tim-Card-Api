const TimCard = require("../models/TimCard");
const TimCardPermission = require("../models/TimCardPermission");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  PositiveResponse,
  NegativeResponse,
  NotValidResponse,
} = require("../utils/responses.js");
const TimCardRecord = require("../models/TimCardRecord");
const { createTimCardDoorLog } = require("../utils/logs");

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
    res
      .status(StatusCodes.OK)
      .json({ timCardPermissions, count: timCardPermissions.length });
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
      .json({ msg: "Bir hata oluştu!", error: error.message });
  }
};

const deleteTimCardPermission = async (req, res) => {
  const timCardPermission = await TimCardPermission.findById(req.params.id);
  if (!timCardPermission) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Böyle bir yetki bulunamadı!" });
  } else {
    try {
      timCardPermission.deleteOne();
      res
        .status(StatusCodes.OK)
        .json({ msg: "Yetki başarılı bir şekilde silindi!" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Bir hata oluştu!", error: error.message });
    }
  }
};

const checkTimCardPermission = async (req, res) => {
  const { card, door } = req.params;
  const timCard = await TimCard.findOne({ cardId: card });
  if (timCard) {
    let isPermitted = false;
    try {
      if (timCard) {
        const timCardPermissions = await TimCardPermission.find({
          card: timCard._id,
          door: door,
        });

        let serverDate = new Date();
        serverDate.setUTCHours(serverDate.getUTCHours() + 3);

        for (const element of timCardPermissions) {
          const startDate = new Date(element.startDate);
          const endDate = new Date(element.endDate);
          if (serverDate >= startDate && serverDate <= endDate) {
            isPermitted = true;
            break;
          }
        }
      }
      if (isPermitted) {
        createTimCardDoorLog(card, door, "Açık", timCard._id);
        res.status(StatusCodes.OK).json(PositiveResponse);
      } else {
        createTimCardDoorLog(card, door, "Kapalı", timCard._id);
        res.status(StatusCodes.UNAUTHORIZED).json(NegativeResponse);
      }
    } catch (error) {
      createTimCardDoorLog(card, door, "Kapalı", timCard._id);
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(NegativeResponse);
    }
  }else{
    createTimCardDoorLog(card, door, "Kapalı");
    res.status(StatusCodes.UNAUTHORIZED).json(NegativeResponse);
  }
};

module.exports = {
  createTimCardPermission,
  deleteTimCardPermission,
  getAllTimCardPermissions,
  getSingleTimCardPermission,
  checkTimCardPermission,
};
