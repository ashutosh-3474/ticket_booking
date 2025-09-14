import React, { useState } from "react";
import { Link } from "react-router-dom";

const popularMovies = [
  { id: 1, title: "Inception", poster: "https://via.placeholder.com/300x450?text=Inception" },
  { id: 2, title: "Avengers", poster: "https://via.placeholder.com/300x450?text=Avengers" },
  { id: 3, title: "Interstellar", poster: "https://via.placeholder.com/300x450?text=Interstellar" },
  { id: 4, title: "The Dark Knight", poster: "https://via.placeholder.com/300x450?text=Dark+Knight" },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % popularMovies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + popularMovies.length) % popularMovies.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-pulse">
          Welcome to 🎬 MovieApp
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Book your favorite movies with ease and enjoy the show!
        </p>
        <Link
          to="/cinemas"
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
        >
          Browse Cinemas
        </Link>
      </div>

      {/* Featured Movies Carousel */}
      <div className="relative max-w-6xl mx-auto my-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Movies</h2>
        <div className="flex items-center justify-center relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 text-3xl font-bold px-4 py-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-80 transition z-10"
          >
            &#8592;
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularMovies
              .slice(currentIndex, currentIndex + 3)
              .map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{movie.title}</h3>
                    <Link
                      to="/movies"
                      className="text-yellow-500 mt-2 inline-block hover:underline"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 text-3xl font-bold px-4 py-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-80 transition z-10"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        &copy; {new Date().getFullYear()} MovieApp. All rights reserved.
      </footer>
    </div>
  );
}
