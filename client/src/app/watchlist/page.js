"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaTrash, FaCheckCircle } from "react-icons/fa";

const WatchlistPage = () => {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);

  // Load watchlist from localStorage only on client
  useEffect(() => {
    const loadWatchlist = () => {
      const stored = localStorage.getItem("watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    };

    loadWatchlist();

    // Sync when visibility or storage changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadWatchlist();
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "watchlist") {
        loadWatchlist();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const markAsWatched = (id) => {
    const updated = watchlist.map((movie) =>
      movie.id === id ? { ...movie, watched: !movie.watched } : movie
    );
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const deleteMovie = (id) => {
    const updated = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-white hover:text-blue-500 transition mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-3xl font-bold text-center mb-8">Your Watchlist 🎞️</h1>

      {watchlist.length === 0 ? (
        <p className="text-gray-400 text-center">No movies in your watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((movie) => (
            <div
              key={movie.id}
              className="relative group overflow-hidden rounded-2xl bg-black shadow-xl hover:scale-105 transition-all duration-300"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className={`w-full h-72 object-cover ${
                    movie.watched ? "opacity-50" : ""
                  }`}
                />
              ) : (
                <div className="w-full h-72 bg-gray-700 flex items-center justify-center text-white">
                  No Image
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
                <h2 className="text-white font-semibold text-lg truncate">{movie.title}</h2>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => markAsWatched(movie.id)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      movie.watched
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    {movie.watched ? (
                      <span className="flex items-center gap-1">
                        <FaCheckCircle /> Watched
                      </span>
                    ) : (
                      "Mark as Watched"
                    )}
                  </button>

                  <button
                    onClick={() => deleteMovie(movie.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
