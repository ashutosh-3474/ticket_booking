import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch show details
  useEffect(() => {
    const fetchShow = async () => {
      try {
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
  }, [showId, token]);

  // Release all selected seats on unmount (back or leave)
// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     // nothing to do
//     return;
//   }

//   // sendBeacon for refresh/close (reliable on unload)
//   const handleBeforeUnload = () => {
//     try {
//       const payload = JSON.stringify({ token });
//       const blob = new Blob([payload], { type: "application/json" });
//       // sendBeacon returns true/false but it's fire-and-forget
//       navigator.sendBeacon(`${API_BASE_URL}/booking/${showId}/release-all`, blob);
//       // NOTE: no await possible here
//     } catch (e) {
//       // fallback -- we swallow errors (unload)
//       console.error("sendBeacon failed", e);
//     }
//   };

//   // back button (popstate) can use normal axios POST with Authorization header
//   const handlePopState = () => {
//     axios.post(`${API_BASE_URL}/booking/${showId}/release-all`, { token }, {
//       headers: { Authorization: `Bearer ${token}` }
//     }).then(() => {
//       console.log("Released seats on back navigation");
//     }).catch(err => {
//       console.error("Failed to release on back nav", err);
//     });
//   };

//   window.addEventListener("beforeunload", handleBeforeUnload);
//   window.addEventListener("popstate", handlePopState);

//   return () => {
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//     window.removeEventListener("popstate", handlePopState);
//   };
// }, [showId]);



  const reserveSeat = async (seatNumber) => {
    try {
      await axios.post(
        `${API_BASE_URL}/bookings/${showId}/reserve`,
        { seatNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSeats((prev) => [...prev, seatNumber]);
    } catch (err) {
      console.error("Reserve error", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to reserve seat");
    }
  };

  const releaseSeat = async (seatNumber) => {
    try {
      await axios.post(
        `${API_BASE_URL}/bookings/${showId}/release`,
        { seatNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSeats((prev) => prev.filter((s) => s !== seatNumber));
    } catch (err) {
      console.error("Release error", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to release seat");
    }
  };

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      releaseSeat(seatNumber);
    } else {
      if (selectedSeats.length >= 6) {
        alert("You can select a maximum of 6 seats");
        return;
      }
      reserveSeat(seatNumber);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!show) return null;

  // Example seat layout: 10x10
  const rows = 10;
  const cols = 10;
  const totalSeats = Array.from({ length: rows * cols }, (_, i) => i + 1);

  const isBooked = (seat) => show.bookedSeats.some((s) => s.seatNumber === seat);
  const isReserved = (seat) => show.reservedSeats.some((s) => s.seatNumber === seat);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">{show.movieId.title}</h2>
        <p className="text-gray-700"><strong>Cinema:</strong> {show.cinemaId.name}</p>
        <p className="text-gray-700"><strong>Screen:</strong> {show.screenNumber}</p>
        <p className="text-gray-700"><strong>Time:</strong> {new Date(show.startTime).toLocaleString()}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Select Seats</h3>
      <div className="grid grid-cols-10 gap-2">
        {totalSeats.map((seat) => {
          const booked = isBooked(seat);
          const reserved = isReserved(seat);
          const selected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              disabled={booked || reserved}
              onClick={() => toggleSeat(seat)}
              className={`w-10 h-10 rounded transition ${booked ? "bg-red-500 cursor-not-allowed" :
                reserved ? "bg-yellow-400 cursor-not-allowed" :
                  selected ? "bg-green-500" :
                    "bg-gray-200 hover:bg-blue-300"
                }`}
              title={`Seat ${seat}${booked ? " (Booked)" : reserved ? " (Reserved)" : ""}`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={selectedSeats.length === 0}
        onClick={() => navigate(`/booking/${showId}`, { state: { selectedSeats, show } })}
      >
        Book Selected Seats
      </button>
    </div>
  );
}
