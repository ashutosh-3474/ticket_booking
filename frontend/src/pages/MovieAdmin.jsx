import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    language: "",
    genre: "",
    releaseDate: "",
    posterUrl: "",
  });

  const token = localStorage.getItem("token");

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/movies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Movies API response:", res.data);
        setMovies(Array.isArray(res.data) ? res.data : []); // Ensure it's an array
      } catch (err) {
        console.error(err);
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  // Open modal for add/edit
  const openModal = (movie = null) => {
    setEditingMovie(movie);
    setFormData(
      movie || {
        title: "",
        description: "",
        duration: "",
        language: "",
        genre: "",
        releaseDate: "",
        posterUrl: "",
      }
    );
    setShowModal(true);
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save movie (add or edit)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        const res = await axios.put(
          `${API_BASE_URL}/movies/${editingMovie._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMovies((prev) =>
          prev.map((m) => (m._id === editingMovie._id ? res.data : m))
        );
      } else {
        const res = await axios.post(`${API_BASE_URL}/movies`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies((prev) => [...prev, res.data]);
      }
      setShowModal(false);
      setEditingMovie(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save movie");
    }
  };

  // Delete movie
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Movies</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Movie
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Title</th>
            <th className="border px-3 py-2">Genre</th>
            <th className="border px-3 py-2">Language</th>
            <th className="border px-3 py-2">Duration</th>
            <th className="border px-3 py-2">Release Date</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <tr key={movie._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{movie.title}</td>
                <td className="border px-3 py-2">{movie.genre}</td>
                <td className="border px-3 py-2">{movie.language}</td>
                <td className="border px-3 py-2">{movie.duration} min</td>
                <td className="border px-3 py-2">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => openModal(movie)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No movies found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingMovie ? "Edit Movie" : "Add Movie"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Genre"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="Language"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration (minutes)"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="releaseDate"
                type="date"
                value={
                  formData.releaseDate
                    ? formData.releaseDate.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="Poster URL"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingMovie ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
