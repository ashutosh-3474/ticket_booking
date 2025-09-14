import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newCinema, setNewCinema] = useState({ name: "", location: "", numberOfScreens: 1 });
  const [editCinema, setEditCinema] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch cinemas
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/cinemas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCinemas(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load cinemas");
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [token]);

  // Add new cinema
  const handleAddCinema = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/cinemas`, newCinema, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCinemas((prev) => [...prev, res.data]);
      setShowModal(false);
      setNewCinema({ name: "", location: "", numberOfScreens: 1 });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add cinema");
    }
  };

  // Open edit modal with pre-filled values
  const handleOpenEdit = (cinema) => {
    setEditCinema(cinema);
    setEditModal(true);
  };

  // Save edited cinema
  const handleEditCinema = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/cinemas/${editCinema._id}`, editCinema, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCinemas((prev) =>
        prev.map((c) => (c._id === editCinema._id ? res.data : c))
      );
      setEditModal(false);
      setEditCinema(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update cinema");
    }
  };

  // Delete cinema
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cinema?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/cinemas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCinemas((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete cinema");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 font-semibold">{user.name} (Admin)</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <span className="text-gray-500 italic">Loading user...</span>
          )}
        </div>
      </div>

      {/* Add Cinema Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add New Cinema
      </button>

      <button
        onClick={() => navigate("/admin/movies")}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Manage Movies
      </button>

      <button
        onClick={() => navigate("/admin/shows")}
        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Manage Shows
      </button>

      {/* Cinemas Table */}
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">numberOfScreens</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.map((cinema) => (
            <tr key={cinema._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{cinema.name}</td>
              <td className="border px-4 py-2">{cinema.location}</td>
              <td className="border px-4 py-2">{cinema.numberOfScreens}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleOpenEdit(cinema)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cinema._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Cinema Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Cinema</h2>
            <form onSubmit={handleAddCinema} className="space-y-4">
              <input
                type="text"
                placeholder="Cinema Name"
                value={newCinema.name}
                onChange={(e) => setNewCinema({ ...newCinema, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newCinema.location}
                onChange={(e) => setNewCinema({ ...newCinema, location: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Number of Screens"
                value={newCinema.numberOfScreens}
                min={1}
                onChange={(e) => setNewCinema({ ...newCinema, numberOfScreens: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cinema Modal */}
      {editModal && editCinema && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Cinema</h2>
            <form onSubmit={handleEditCinema} className="space-y-4">
              <input
                type="text"
                placeholder="Cinema Name"
                value={editCinema.name}
                onChange={(e) => setEditCinema({ ...editCinema, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={editCinema.location}
                onChange={(e) => setEditCinema({ ...editCinema, location: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Number of Screens"
                value={editCinema.numberOfScreens}
                min={1}
                onChange={(e) =>
                  setEditCinema({ ...editCinema, numberOfScreens: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
