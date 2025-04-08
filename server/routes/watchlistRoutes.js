// POST /api/watchlist/add
router.post("/add", async (req, res) => {
    const { userId, tmdbId, title, posterPath, reminderDate } = req.body;
    try {
      const user = await User.findById(userId);
      user.watchlist.push({
        tmdbId,
        title,
        posterPath,
        reminderDate: reminderDate || null
      });
      await user.save();
      res.status(201).json({ message: "Movie added with reminder!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to add movie", err });
    }
  });
  