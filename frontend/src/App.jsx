import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cinema from "./pages/Cinema";
import Movies from "./pages/Movie";
import MovieDetail from "./pages/MovieDetail";
import SeatSelection from "./pages/Seatselection";
import BookingPage from "./pages/Booking";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesAdmin from "./pages/MovieAdmin";
import ShowAdmin from "./pages/ShowAdmin";
import AdminRoute from "./routes/AdminProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar /> {/* Navbar inside AuthProvider */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected User Routes */}
            <Route
              path="/cinemas"
              element={
                <ProtectedRoute>
                  <Cinema />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movie-detail/:cinemaId/:movieId"
              element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seatselection/:showId"
              element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:showId"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <AdminRoute>
                  <MoviesAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shows"
              element={
                <AdminRoute>
                  <ShowAdmin />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
