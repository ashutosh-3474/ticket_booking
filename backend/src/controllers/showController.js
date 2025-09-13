const { request } = require("express");
const Show = require("../models/show");
const Cinema = require("../models/cinema");
const Movie = require("../models/movie");
const { removeExpiredReservedSeats } = require("./bookingController");

exports.getShows = async (req, res) => {
  try {
    const { cinemaId, movieId } = req.query;

    // console.log("request.query:", req.query);

    if (!cinemaId || !movieId) {
      return res.status(400).json({ error: "cinemaId and movieId are required" });
    }

    const now = new Date();

    const shows = await Show.find({
      cinemaId: cinemaId,
      movieId: movieId,
      startTime: { $gt: now } // only future shows
    })
      .populate("cinemaId")
      .populate("movieId")
      .sort({ startTime: 1 }); // earliest first

    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const { showId } = req.params;

    await removeExpiredReservedSeats(showId);

    const show = await Show.findById(showId)
      .populate("cinemaId")
      .populate("movieId");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (err) {
    console.error("Error fetching show by ID:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
