const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number, // in minutes
  language: String,
  genre: String,
  releaseDate: Date,
  posterUrl: String,
});

module.exports = mongoose.model("Movie", movieSchema);
