const Cinema = require("../models/cinema");

// @desc    Get all cinemas
// @route   GET /api/cinemas
// @access  Public
exports.getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    // console.log(cinemas);
    // console.log("Fetched cinemas successfully");
    res.json(cinemas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
