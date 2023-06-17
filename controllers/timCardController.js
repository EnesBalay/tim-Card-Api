const TimCard = require("../models/TimCard");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createTimCard = async (req, res) => {
  try {
    const searchCard = await TimCard.findOne({ cardId: req.body.cardId });
    if (searchCard) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Bu kart sistemde kayıtlı" });
    } else {
      const timCard = await TimCard.create(req.body);
      res.status(StatusCodes.CREATED).json({ timCard });
    }
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB benzersizlik hatası
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Bu kart sistemde kayıtlı" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Kart oluşturulurken bir hata oluştu" });
    }
  }
};

const getAllTimCards = async (req, res) => {
  const timCards = await TimCard.find({});
  res.status(StatusCodes.OK).json({ timCards, count: timCards.length });
};

const getSingleTimCard = async (req, res) => {
  const { id: id } = req.params;
  const timCard = await TimCard.findOne({ _id: id });

  if (!timCard) {
    throw new CustomError.NotFoundError(`No timCard with id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ timCard });
};

const updateTimCard = async (req, res) => {
  const { id: timCardId } = req.params;

  const timCard = await TimCard.findOneAndUpdate({ _id: timCardId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!timCard) {
    throw new CustomError.NotFoundError(`No timCard with id : ${timCardId}`);
  }

  res.status(StatusCodes.OK).json({ timCard });
};

const deleteTimCard = async (req, res) => {
  const { id: timCardId } = req.params;
  const timCard = await TimCard.findOne({ _id: timCardId });

  if (!timCard) {
    throw new CustomError.NotFoundError(`No timCard with id : ${timCardId}`);
  }

  await timCard.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! TimCard removed." });
};

module.exports = {
  createTimCard,
  getAllTimCards,
  getSingleTimCard,
  updateTimCard,
  deleteTimCard,
};
