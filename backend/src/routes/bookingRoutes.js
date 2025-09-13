// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:showId/reserve", protect, bookingController.reserveSeat);   // body: { seatNumber }
router.post("/:showId/release", protect, bookingController.releaseSeat); 
router.post("/:showId/release-all", protect, bookingController.releaseAllUserSeats);
router.post("/:showId/book", protect, bookingController.bookSeats); // body: { seats: [..] }

module.exports = router;
