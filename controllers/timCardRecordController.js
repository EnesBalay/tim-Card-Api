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
    select:"cardId name teskilat"
  });
  res
    .status(StatusCodes.OK)
    .json({ timCardRecords, count: timCardRecords.length });
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
      `No timCardRecord with id : ${timCardRecordId}`
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
      `No timCardRecord with id : ${timCardRecordId}`
    );
  }

  res.status(StatusCodes.OK).json({ timCardRecord });
};

const deleteTimCardRecord = async (req, res) => {
  const { id: timCardRecordId } = req.params;
  const timCardRecord = await TimCardRecord.findOne({ _id: timCardRecordId });

  if (!timCardRecord) {
    throw new CustomError.NotFoundError(
      `No timCardRecord with id : ${timCardRecordId}`
    );
  }

  await timCardRecord.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! TimCardRecord removed." });
};

module.exports = {
  createTimCardRecord,
  getAllTimCardRecords,
  getSingleTimCardRecord,
  updateTimCardRecord,
  deleteTimCardRecord,
  updateCardRecordWithCardId,
};
