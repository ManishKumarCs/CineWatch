const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getMovies);
router.post('/', movieController.addMovie);
router.patch('/:id/toggle', movieController.toggleWatched);
router.delete('/:id', movieController.deleteMovie);

// 🆕 New reminder route
router.get('/reminders/:userId', movieController.getReminders);

module.exports = router;
