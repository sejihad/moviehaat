const express = require("express");
const {
  createMovie,
  deleteMovie,
  getAdminMovie,
  getAdminMovies,
  getMovie,
  getMovies,
  updateMovie,
} = require("../controllers/movieController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/movies", getMovies);
router.get("/movie/:slug", getMovie);
router.get("/admin/movies", isAuthenticator, authorizeRoles("admin"), getAdminMovies);
router.post("/admin/movie/new", isAuthenticator, authorizeRoles("admin"), createMovie);
router
  .route("/admin/movie/:id")
  .get(isAuthenticator, authorizeRoles("admin"), getAdminMovie)
  .put(isAuthenticator, authorizeRoles("admin"), updateMovie)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteMovie);

module.exports = router;
