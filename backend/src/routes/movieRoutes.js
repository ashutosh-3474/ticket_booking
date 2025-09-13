const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, movieController.getMovies);
router.post("/", protect, adminOnly, movieController.addMovie);

module.exports = router;
