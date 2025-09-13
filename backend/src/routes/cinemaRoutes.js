const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");
const { protect } = require("../middleware/authMiddleware");

// Public - Get all cinemas
router.get("/", protect, cinemaController.getCinemas);

module.exports = router;
