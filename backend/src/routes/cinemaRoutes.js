const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public - Get all cinemas
router.get("/", protect, cinemaController.getCinemas);

router.post("/", protect, adminOnly, cinemaController.addCinema);
router.put("/:id", protect, adminOnly, cinemaController.updateCinema);
router.delete("/:id", protect, adminOnly, cinemaController.deleteCinema);

module.exports = router;
