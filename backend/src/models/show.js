const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  row: Number,
  col: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // only for reservedSeats
  reservedAt: { type: Date, default: Date.now },                // for timeout
});

const showSchema = new mongoose.Schema({
  cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema", required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  screenNumber: { type: Number, required: true },
  startTime: { type: Date, required: true },
  bookedSeats: [ { row: Number, col: Number } ],
  reservedSeats: [ seatSchema ]
});

module.exports = mongoose.model("Show", showSchema);
