const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");

router.get("/", showController.getShows);
router.post("/", showController.addShow);
// router.post("/:id/reserve", showController.reserveSeats);

module.exports = router;
