import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  addMovie,
  deleteMovie,
  getWatchlist,
  updateMovie,
} from "../utils/db.js";

const router = express.Router();

router.get("/:userId", authenticate, (req, res) => {
  const watchlist = getWatchlist(Number(req.params.userId));

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(watchlist);
});

router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const movie = addMovie(Number(req.params.userId), req.body);

    if (!movie) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json(movie);
  },
);

router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const movie = updateMovie(
      Number(req.params.userId),
      Number(req.params.movieId),
      req.body,
    );

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movie);
  },
);

router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const deleted = deleteMovie(
      Number(req.params.userId),
      Number(req.params.movieId),
    );

    if (!deleted) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ success: true });
  },
);

export default router;