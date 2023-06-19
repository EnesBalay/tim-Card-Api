const express = require("express");
const {
  getAllTimCardRecords,
  deleteTimCardRecord,
  deleteAllTimCardRecords,
  getEndTimCardRecords,
} = require("../controllers/timCardRecordController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("Admin"), getAllTimCardRecords)
  .delete(
    authenticateUser,
    authorizePermissions("Admin"),
    deleteAllTimCardRecords
  );
router
  .route("/getByLimit/:limit")
  .get(authenticateUser, authorizePermissions("Admin"), getEndTimCardRecords);

router
  .route("/:id")
  .delete(authenticateUser, authorizePermissions("Admin"), deleteTimCardRecord);
module.exports = router;
