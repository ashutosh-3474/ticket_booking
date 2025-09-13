import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../config"

export default function MovieDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cinemaId, movieId } = useParams() // get cinemaId & movieId from state

  const [movie, setMovie] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!cinemaId || !movieId) {
      alert("Invalid access. Please select a cinema and movie first.")
      navigate("/") // redirect to cinema page
      return
    }

    const fetchMovieAndShows = async () => {
      try {
        const token = localStorage.getItem("token")

        // 1️⃣ Fetch movie details
        const movieRes = await axios.get(`${API_BASE_URL}/movies/${movieId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        setMovie(movieRes.data)

        // 2️⃣ Fetch shows for this movie + cinema
        const showsRes = await axios.get(
          `${API_BASE_URL}/shows?cinemaId=${cinemaId}&movieId=${movieId}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        )

        setShows(showsRes.data)
      } catch (err) {
        console.error(err)
        if (err.response && err.response.status === 401) {
          alert("You need to login to view this page")
          navigate("/login")
        } else {
          setError("Failed to fetch movie or shows")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMovieAndShows()
  }, [cinemaId, movieId, navigate])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="container mx-auto px-4 py-8">
      {movie && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">{movie.title}</h1>
          <p className="text-gray-700 mb-2"><strong>Genre:</strong> {movie.genre}</p>
          <p className="text-gray-700 mb-2"><strong>Language:</strong> {movie.language}</p>
          <p className="text-gray-700 mb-2"><strong>Duration:</strong> {movie.duration} mins</p>
          <p className="text-gray-700 mb-2"><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p className="text-gray-600 mt-4">{movie.description}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Available Shows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shows.length > 0 ? (
          shows.map((show) => (
            <div
              key={show._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate("/seats", { state: { showId: show._id } })}
            >
              <p className="font-semibold">Screen {show.screenNumber}</p>
              <p className="text-gray-600">
                {new Date(show.startTime).toLocaleString()}
              </p>
              <p className="text-gray-500 mt-2">
                Booked Seats: {show.bookedSeats.length}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No upcoming shows available for this movie in this cinema.</p>
        )}
      </div>
    </div>
  )
}
