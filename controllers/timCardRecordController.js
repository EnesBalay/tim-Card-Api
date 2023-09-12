const TimCardRecord = require("../models/TimCardRecord");
const TimCard = require("../models/TimCard");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createTimCardRecord = async (req, res) => {
  const timCardRecord = await TimCardRecord.create(req.body);
  res.status(StatusCodes.CREATED).json({ timCardRecord });
};

const getAllTimCardRecords = async (req, res) => {
  const timCardRecords = await TimCardRecord.find({}).populate({
    path: "card",
    select: "cardId name teskilat",
  });
  res
    .status(StatusCodes.OK)
    .json({ timCardRecords, count: timCardRecords.length });
};

const getEndTimCardRecords = async (req, res) => {
  const { limit } = req.params;
  const timCardRecords = await TimCardRecord.find({})
    .populate({
      path: "card",
      select: "cardId name teskilat",
    })
    .sort({ _id: -1 })
    .limit(limit)
    .exec()
    .then((records) => {
      console.log("Son" + limit + "kayıt:", records);
      res.status(StatusCodes.OK).json({ records, count: records.length });
    })
    .catch((error) => {
      console.log("Kayıt getirme hatası:", error);
    });
};

const updateCardRecordWithCardId = async (req, res) => {
  const timCardRecord = await TimCardRecord.find({});
  const timCards = await TimCard.find({});
  timCardRecord.forEach((element) => {
    timCards.forEach((e) => {
      if (e.cardId == element.cardId) {
        element.card = e._id;
        element.save();
      }
    });
  });
  res.status(StatusCodes.OK).json("oldu");
};

const getSingleTimCardRecord = async (req, res) => {
  const { id: timCardRecordId } = req.params;
  const timCardRecord = await TimCardRecord.findOne({ _id: timCardRecordId });

  if (!timCardRecord) {
    throw new CustomError.NotFoundError(
      `Bu id ile bir kart kaydı bulunamadı  : ${timCardRecordId}`
    );
  }

  res.status(StatusCodes.OK).json({ timCardRecord });
};

const updateTimCardRecord = async (req, res) => {
  const { id: timCardRecordId } = req.params;

  const timCardRecord = await TimCardRecord.findOneAndUpdate(
    { _id: timCardRecordId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!timCardRecord) {
    throw new CustomError.NotFoundError(
      `Bu id ile bir kart kaydı bulunamadı  : ${timCardRecordId}`
    );
  }

  res.status(StatusCodes.OK).json({ timCardRecord });
};

const deleteTimCardRecord = async (req, res) => {
  const { id: timCardRecordId } = req.params;
  const timCardRecord = await TimCardRecord.findOne({ _id: timCardRecordId });

  if (!timCardRecord) {
    throw new CustomError.NotFoundError(
      `Bu id ile bir kart kaydı bulunamadı : ${timCardRecordId}`
    );
  }

  await timCardRecord.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Başarılı! Kart kaydı silindi." });
};

const deleteAllTimCardRecords = async (req, res) => {
  try {
    await TimCardRecord.deleteMany({});
    res
      .status(StatusCodes.OK)
      .json({ msg: "Başarılı! Bütün kart kayıtları silindi." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Bir hata oluştu!", error: error.message });
  }
};

module.exports = {
  createTimCardRecord,
  getAllTimCardRecords,
  getSingleTimCardRecord,
  updateTimCardRecord,
  deleteTimCardRecord,
  updateCardRecordWithCardId,
  deleteAllTimCardRecords,
  getEndTimCardRecords,
};
