const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");

// Public - Get all cinemas
router.get("/", cinemaController.getCinemas);

module.exports = router;
