const express = require("express");
const {
  createTimCard,
  getAllTimCards,
  updateTimCard,
  deleteTimCard,
  getSingleTimCard,
} = require("../controllers/timCardController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("Admin"), getAllTimCards);

router
  .route("/:id")
  .put(authenticateUser, authorizePermissions("Admin"), updateTimCard)
  .get(authenticateUser, authorizePermissions("Admin"), getSingleTimCard)
  .delete(authenticateUser, authorizePermissions("Admin"), deleteTimCard);

router
  .route("/add")
  .post(authenticateUser, authorizePermissions("Admin"), createTimCard);

module.exports = router;
