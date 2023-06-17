const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  createJwt,
} = require("../utils");

const register = async (req, res) => {
  const { username, password } = req.body;

  const usernameAlreadyExists = await User.findOne({ username });

  if (usernameAlreadyExists) {
    throw new CustomError.BadRequestError("Username already exist");
  }
  //first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "Admin" : req.body.role;
  const user = await User.create({
    username,
    password,
    role,
    status,
  });
  const tokeunUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokeunUser });
  res.status(StatusCodes.CREATED).json({ user: tokeunUser });
};
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError.BadRequestError(
      " Please provide username and password"
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      "Kullanıcı Adı veya Şifre Hatalı!"
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      "Kullanıcı Adı veya Şifre Hatalı!"
    );
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  const token = createJwt({ payload: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser, token: token });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

module.exports = { register, login, logout };
