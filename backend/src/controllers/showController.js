const { request } = require("express");
const Show = require("../models/show");


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


exports.addShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
