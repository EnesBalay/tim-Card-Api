const express = require("express");
const {
  createTimCardPermission,
  deleteTimCardPermission,
  getAllTimCardPermissions,
  getSingleTimCardPermission,
} = require("../controllers/timCardPermissionController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(
    authenticateUser,
    authorizePermissions("Admin"),
    getAllTimCardPermissions
  )
  .post(
    authenticateUser,
    authorizePermissions("Admin"),
    createTimCardPermission
  );

router
  .route("/:id")
  .get(
    authenticateUser,
    authorizePermissions("Admin"),
    getSingleTimCardPermission
  )
  .delete(
    authenticateUser,
    authorizePermissions("Admin"),
    deleteTimCardPermission
  );

module.exports = router;
