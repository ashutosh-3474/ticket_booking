import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function BookingPage() {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Move here, top-level
  const { selectedSeats } = location.state || {};

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!showId) return navigate("/", { replace: true });

    const fetchShow = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/shows/${showId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setShow(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId, navigate]);

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/bookings/${showId}/book`,
        { seats: selectedSeats },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setBookingDetails(res.data.booking);
      setBookingConfirmed(true);
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const closePopup = () => {
    // ✅ Replace history so user cannot go back to seat selection
    navigate("/cinemas", { replaceAll: true });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!show) return null;

  if (bookingConfirmed)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Booking Confirmed!
          </h2>
          <p><strong>Booking ID:</strong> {bookingDetails._id}</p>
          <p><strong>Movie:</strong> {show.movieId.title}</p>
          <p><strong>Cinema:</strong> {show.cinemaId.name}</p>
          <p><strong>Seats:</strong> {bookingDetails.seats.join(", ")}</p>
          <p><strong>Time:</strong> {new Date(show.startTime).toLocaleString()}</p>

          <button
            onClick={closePopup}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{show.movieId.title} - Booking</h2>
      <p><strong>Cinema:</strong> {show.cinemaId.name}</p>
      <p><strong>Screen:</strong> {show.screenNumber}</p>
      <p><strong>Time:</strong> {new Date(show.startTime).toLocaleString()}</p>
      <p><strong>Selected Seats:</strong> {selectedSeats.join(", ")}</p>

      <button
        onClick={confirmBooking}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </div>
  );
}
