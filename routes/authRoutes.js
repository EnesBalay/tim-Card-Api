const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const { register, login, logout } = require("../controllers/authController");
const {
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.post("/login", login);
// router.post("/register", register);
router
  .route("/register")
  .post(authenticateUser, authorizePermissions("Admin"), register);
router.get("/logout", logout);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router
  .route("/update/:id")
  .patch(authenticateUser, authorizePermissions("Admin"), updateUser);
router.route("/updatePassword").patch(authenticateUser, updateUserPassword);
module.exports = router;
