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


// ✅ Add a new cinema
exports.addCinema = async (req, res) => {
  try {
    const { name, location, numberOfScreens } = req.body;
    if (!name || !location || !numberOfScreens) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cinema = new Cinema({ name, location, numberOfScreens });
    await cinema.save();
    res.status(201).json(cinema);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Edit cinema
exports.updateCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, numberOfScreens } = req.body;

    console.log("Updating cinema:", id, name, location, numberOfScreens);

    const cinema = await Cinema.findByIdAndUpdate(
      id,
      { name, location, numberOfScreens },
      { new: true }
    );

    if (!cinema) return res.status(404).json({ message: "Cinema not found" });

    res.json(cinema);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete cinema
exports.deleteCinema = async (req, res) => {
  try {
    const { id } = req.params;

    const cinema = await Cinema.findByIdAndDelete(id);
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });

    res.json({ message: "Cinema deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getCinemaById = async (req, res) => {
  try {
    const { Id } = req.params;

    const cinema = await Cinema.findById(Id);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    res.json(cinema);
  } catch (err) {
    console.error("Error fetching cinema by ID:", err.message);
    // Handle invalid ObjectId error
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid cinema ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};