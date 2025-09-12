require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");

// Connect DB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Test route
app.get("/", (req, res) => {
  res.send("Movie Booking API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
