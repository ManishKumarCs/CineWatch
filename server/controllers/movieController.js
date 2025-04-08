const Movie = require('../models/Movie');

// Get all movies
exports.getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

// Add a movie with reminder
exports.addMovie = async (req, res) => {
  const { title, tmdbId, posterPath, userId, reminderDate } = req.body;

  const movie = new Movie({
    title,
    tmdbId,
    poster: posterPath,
    userId,
    reminderDate: reminderDate ? new Date(reminderDate) : null
  });

  await movie.save();
  res.status(201).json(movie);
};

// Toggle watched status
exports.toggleWatched = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  movie.watched = !movie.watched;
  await movie.save();
  res.json(movie);
};

// Delete movie
exports.deleteMovie = async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

// 🆕 Get movies with reminders for a specific user
exports.getReminders = async (req, res) => {
  const { userId } = req.params;

  const reminders = await Movie.find({
    userId,
    reminderDate: { $ne: null }
  }).sort({ reminderDate: 1 });

  res.json(reminders);
};
