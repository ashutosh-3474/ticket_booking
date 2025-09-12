const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  numberOfScreens: {
    type: Number,
    required: true,
    min: 1,
  },
});

module.exports = mongoose.model("Cinema", cinemaSchema);
