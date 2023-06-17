const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  updateUserPasswordUser,
} = require("../controllers/userController");

router
  .route("/getAll/:status")
  .get(authenticateUser, authorizePermissions("Admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);

router
  .route("/updateUserPassword/:id")
  .patch(authenticateUser, authorizePermissions("Admin"), updateUserPassword);
router
  .route("/updateUserPasswordUser")
  .patch(authenticateUser, updateUserPasswordUser);

router
  .route("/:id")
  .get(authenticateUser, authorizePermissions("Admin"), getSingleUser)
  .delete(authenticateUser, authorizePermissions("Admin"), deleteUser)
  .patch(authenticateUser, authorizePermissions("Admin"), updateUser);

router.route("/register").post(authenticateUser, authorizePermissions("Admin"));
module.exports = router;
