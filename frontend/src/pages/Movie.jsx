import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../config"

export default function Movies() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cinemaId } = location.state || {} // get cinemaId from state
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!cinemaId) {
      // If someone navigates directly without selecting cinema
      alert("Please select a cinema first")
      navigate("/") // redirect to cinema page
      return
    }

    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${API_BASE_URL}/movies`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        setMovies(res.data)
      } catch (err) {
        console.error(err)
        if (err.response && err.response.status === 401) {
          alert("You need to login to view movies")
          navigate("/login")
        } else {
          setError("Failed to fetch movies")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [cinemaId, navigate])

  if (loading) return <p className="text-center mt-10">Loading movies...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer"
            onClick={() =>
              navigate(`/movie-detail/${cinemaId}/${movie._id}`)
            }
          >
            <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
            <p className="text-gray-600">{movie.genre}</p>
            <p className="text-gray-600">{movie.language}</p>
            <p className="text-gray-500 text-sm mt-2">{movie.duration} mins</p>
          </div>
        ))}
      </div>
    </div>
  )
}
