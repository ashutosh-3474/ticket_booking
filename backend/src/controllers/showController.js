const Show = require("../models/show");
const Cinema = require("../models/cinema");
const Movie = require("../models/movie");
const { removeExpiredReservedSeats } = require("./bookingController");

// ✅ Get all shows (future shows for a cinema & movie)
exports.getShows = async (req, res) => {
  try {
    const { cinemaId, movieId } = req.query;

    if (!cinemaId || !movieId) {
      return res.status(400).json({ error: "cinemaId and movieId are required" });
    }

    const now = new Date();

    const shows = await Show.find({
      cinemaId,
      movieId,
      startTime: { $gt: now }
    })
      .populate("cinemaId")
      .populate("movieId")
      .sort({ startTime: 1 });

    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get single show by ID
exports.getShowById = async (req, res) => {
  try {
    const { showId } = req.params;

    await removeExpiredReservedSeats(showId);

    const show = await Show.findById(showId)
      .populate("cinemaId")
      .populate("movieId");

    if (!show) return res.status(404).json({ message: "Show not found" });

    res.json(show);
  } catch (err) {
    console.error("Error fetching show by ID:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add new show
exports.addShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update show
exports.updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findByIdAndUpdate(id, req.body, { new: true });
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ Delete show
exports.deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findByIdAndDelete(id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("cinemaId", "name location")   // fetch cinema details
      .populate("movieId", "title duration")   // fetch movie details
      .sort({ startTime: 1 });

    res.status(200).json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};