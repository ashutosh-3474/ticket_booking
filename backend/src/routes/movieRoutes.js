const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, movieController.getMovies);
router.get("/:movieId", protect, movieController.getMovieById);
router.post("/", protect, adminOnly, movieController.addMovie);
router.put("/:id", protect, adminOnly, movieController.updateMovie);
router.delete("/:id", protect, adminOnly, movieController.deleteMovie);

module.exports = router;
