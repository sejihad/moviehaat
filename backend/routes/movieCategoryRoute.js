const express = require("express");
const {
  createMovieCategory,
  deleteMovieCategory,
  getMovieCategories,
  getMovieCategory,
  updateMovieCategory,
} = require("../controllers/movieCategoryController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const adminOnly = [isAuthenticator, authorizeRoles("admin")];

router.get("/movie-categories", getMovieCategories);
router.get("/admin/movie-categories", ...adminOnly, getMovieCategories);
router.post("/admin/movie-category/new", ...adminOnly, createMovieCategory);
router
  .route("/admin/movie-category/:id")
  .get(...adminOnly, getMovieCategory)
  .put(...adminOnly, updateMovieCategory)
  .delete(...adminOnly, deleteMovieCategory);

module.exports = router;
