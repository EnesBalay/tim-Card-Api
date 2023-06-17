const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const status = req.params.status;
  let users = await User.find({
    status: status === "1" ? true : false,
  }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(
      `No user with that id: ${req.params.id}`
    );
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const id = req.params.id;

  const user = await User.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
  });

  const tokeunUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokeunUser });
  res.status(StatusCodes.OK).json({ user: tokeunUser });
};

const updateUserPassword = async (req, res) => {
  const id = req.params.id;
  const { newPassword } = req.body;

  const user = await User.findOneAndUpdate(
    {
      _id: id,
    },
    { password: newPassword },
    {
      runValidators: true,
    }
  );

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

const updateUserPasswordUser = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }

  const user = await User.findOne({
    _id: req.user.userId,
  });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${userId}`);
  }

  user.status = req.body.status;
  if (req.body.atilmaNedeni) {
    user.atilmaNedeni = req.body.atilmaNedeni;
  }
  user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! User removed." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  updateUserPasswordUser,
};
