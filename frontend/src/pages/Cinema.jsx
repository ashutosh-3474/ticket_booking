import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config"

export default function Cinema() {
  const [cinemas, setCinemas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const token = localStorage.getItem("token") // get JWT if available

        const res = await axios.get(`${API_BASE_URL}/cinemas`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        setCinemas(res.data)
      } catch (err) {
        console.error(err)

        if (err.response && err.response.status === 401) {
          alert("You need to login to access cinemas") // show message
          navigate("/login") // redirect to login page
        } else {
          setError("Failed to fetch cinemas")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCinemas()
  }, [navigate])

  if (loading) return <p className="text-center mt-10">Loading cinemas...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Cinemas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cinemas.map((cinema) => (
          <div
            key={cinema._id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{cinema.name}</h2>
            <p className="text-gray-600">{cinema.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
