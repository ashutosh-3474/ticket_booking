import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function ShowAdmin() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [form, setForm] = useState({
    _id: null,
    cinemaId: "",
    movieId: "",
    screenNumber: "",
    startTime: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all shows
  const fetchShows = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/shows/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setShows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching shows:", err.response?.data || err);
    }
  };

  // Fetch movies and cinemas
  const fetchMoviesAndCinemas = async () => {
    try {
      const movieRes = await axios.get(`${API_BASE_URL}/movies`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setMovies(movieRes.data);

      const cinemaRes = await axios.get(`${API_BASE_URL}/cinemas`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCinemas(cinemaRes.data);
    } catch (err) {
      console.error("Error fetching movies/cinemas:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchShows();
    fetchMoviesAndCinemas();
  }, []);

  // Update selectedCinema when cinema changes
  useEffect(() => {
    if (form.cinemaId) {
      const fetchCinema = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/cinemas/${form.cinemaId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          console.log("Fetched cinema details:", res.data);
          setSelectedCinema(res.data);
        } catch (err) {
          console.error("Error fetching cinema details:", err.response?.data || err);
        }
      };
      fetchCinema();
    } else {
      setSelectedCinema(null);
    }
  }, [form.cinemaId, token]);

  // Open modal for add/edit
  const openModal = (show = null) => {
    if (show) {
      setForm({
        _id: show._id,
        cinemaId: show.cinemaId?._id || "",
        movieId: show.movieId?._id || "",
        screenNumber: show.screenNumber || "",
        startTime: show.startTime ? new Date(show.startTime).toISOString().slice(0, 16) : "",
      });
    } else {
      setForm({ _id: null, cinemaId: "", movieId: "", screenNumber: "", startTime: "" });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        cinemaId: form.cinemaId,
        movieId: form.movieId,
        screenNumber: Number(form.screenNumber),
        startTime: new Date(form.startTime),
      };

      if (form._id) {
        await axios.put(`${API_BASE_URL}/shows/${form._id}`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } else {
        await axios.post(`${API_BASE_URL}/shows`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }

      setIsModalOpen(false);
      fetchShows();
    } catch (err) {
      console.error("Error saving show:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/shows/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchShows();
    } catch (err) {
      console.error("Error deleting show:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Shows</h1>
        <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add Show
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shows.map((show) => (
          <div key={show._id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold">{show.movieId?.title || "Unknown Movie"}</h2>
            <p>Cinema: {show.cinemaId?.name || "Unknown Cinema"}</p>
            <p>Screen: {show.screenNumber}</p>
            <p>
              Start Time:{" "}
              {new Date(show.startTime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <div className="flex space-x-2 mt-3">
              <button onClick={() => openModal(show)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(show._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{form._id ? "Edit Show" : "Add Show"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="movieId" value={form.movieId} onChange={handleChange} className="w-full border p-2 rounded" required>
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>

              <select name="cinemaId" value={form.cinemaId} onChange={handleChange} className="w-full border p-2 rounded" required>
                <option value="">Select Cinema</option>
                {cinemas.map((cinema) => (
                  <option key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </option>
                ))}
              </select>

              <select name="screenNumber" value={form.screenNumber} onChange={handleChange} className="w-full border p-2 rounded" required disabled={!selectedCinema}>
                <option value="">Select Screen</option>
                {selectedCinema &&
                  Array.from({ length: selectedCinema.numberOfScreens  || 0 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Screen {num}
                    </option>
                  ))}
              </select>

              <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} className="w-full border p-2 rounded" required />

              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  {form._id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
