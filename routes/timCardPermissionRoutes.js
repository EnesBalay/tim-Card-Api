const express = require("express");
const {
  createTimCardPermission,
} = require("../controllers/timCardPermissionController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions("Admin"),
    createTimCardPermission
  );

module.exports = router;
