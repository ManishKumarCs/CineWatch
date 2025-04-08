"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
    fetchTrendingMovies();

    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  // Persist watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchTrendingMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
          },
        }
      );
      setTrendingMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            query: searchTerm,
          },
        }
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
    setLoading(false);
  };

  const addToWatchlist = (movie) => {
    const isAlreadyInWatchlist = watchlist.some((item) => item.id === movie.id);
    if (!isAlreadyInWatchlist) {
      const updated = [...watchlist, movie];
      setWatchlist(updated);
      toast.success(`${movie.title} added to watchlist!`);
    } else {
      toast.info("Already in watchlist.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-8 relative">
      <ToastContainer position="top-center" theme="dark" />

      {/* Watchlist Badge */}
      <div className="absolute top-4 right-6 z-50">
        <Link href="/watchlist" className="relative text-white hover:text-blue-500 text-2xl">
          <FaHeart title="Go to Watchlist" />
          {watchlist.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-xs rounded-full px-1.5 py-0.5">
              {watchlist.length}
            </span>
          )}
        </Link>
      </div>

      {/* Welcome Message */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">Welcome to CineWatch 🎬</h2>
            <p className="text-gray-700">
              Discover trending movies and manage your personalized watchlist.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8">Welcome to CineFinder 🎥</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="flex shadow-md">
          <input
            type="text"
            placeholder="Search for movies..."
            className="px-4 py-2 rounded-l-md text-white w-64 bg-gray-800 border border-blue-600 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition border border-blue-600 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center mt-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {searchResults.length > 0 ? "Search Results" : "Trending Movies"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(searchResults.length > 0 ? searchResults : trendingMovies).map((movie) => (
              <div
                key={movie.id}
                className="relative group overflow-hidden rounded-2xl bg-black shadow-xl hover:scale-105 transition-all duration-300"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-700 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
                  <h2 className="text-white font-semibold text-lg truncate">{movie.title}</h2>
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-full self-start transition cursor-pointer"
                  >
                    + Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
