const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/all", protect, adminOnly, showController.getAllShows);
router.get("/", protect, showController.getShows);
router.get("/:showId", protect, showController.getShowById);
router.post("/", protect, adminOnly, showController.addShow);
router.put("/:id", protect, adminOnly, showController.updateShow);
router.delete("/:id", protect, adminOnly, showController.deleteShow);

module.exports = router;
