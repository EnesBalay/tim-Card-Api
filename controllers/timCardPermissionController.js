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
    console.log(req.body);
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

module.exports = {
  createTimCardPermission,
  deleteTimCardPermission,
  getAllTimCardPermissions,
  getSingleTimCardPermission,
};
