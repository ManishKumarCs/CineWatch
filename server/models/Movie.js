const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  tmdbId: String,
  poster: String,
  watched: { type: Boolean, default: false },
  userId: String,
  reminderDate: Date
});

module.exports = mongoose.model('Movie', movieSchema);
