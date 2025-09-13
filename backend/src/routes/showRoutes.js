const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, showController.getShows);
router.get("/:showId", protect, showController.getShowById);
router.post("/", protect, adminOnly, showController.addShow);
// router.post("/:id/reserve", showController.reserveSeats);

module.exports = router;
