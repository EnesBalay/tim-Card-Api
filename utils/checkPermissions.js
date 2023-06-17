const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "Admin" || requestUser.role === "User") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new CustomError.UnauthorizedError("Yetkiniz Bulunmamaktadır..");
};

module.exports = checkPermissions;
