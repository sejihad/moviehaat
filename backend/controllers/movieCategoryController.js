const MovieCategory = require("../models/movieCategoryModel");
const Movie = require("../models/movieModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const parseBoolean = (value) => value === true || value === "true";

exports.createMovieCategory = catchAsyncErrors(async (req, res, next) => {
  const name = String(req.body.name || "").trim();
  if (!name) return next(new ErrorHandler("Category name is required", 400));

  const category = await MovieCategory.create({
    name,
    description: req.body.description,
    active: req.body.active === undefined ? true : parseBoolean(req.body.active),
    createdBy: req.user.id,
  });
  res.status(201).json({ success: true, message: "Movie category created successfully", category });
});

exports.getMovieCategories = catchAsyncErrors(async (req, res) => {
  const filter = req.user?.role === "admin" ? {} : { active: true };
  const categories = await MovieCategory.find(filter).sort({ name: 1 });
  res.json({ success: true, categories });
});

exports.getMovieCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await MovieCategory.findById(req.params.id);
  if (!category) return next(new ErrorHandler("Movie category not found", 404));
  res.json({ success: true, category });
});

exports.updateMovieCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await MovieCategory.findById(req.params.id);
  if (!category) return next(new ErrorHandler("Movie category not found", 404));
  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();
    if (!name) return next(new ErrorHandler("Category name cannot be empty", 400));
    category.name = name;
  }
  if (req.body.description !== undefined) category.description = req.body.description;
  if (req.body.active !== undefined) category.active = parseBoolean(req.body.active);
  await category.save();
  res.json({ success: true, message: "Movie category updated successfully", category });
});

exports.deleteMovieCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await MovieCategory.findById(req.params.id);
  if (!category) return next(new ErrorHandler("Movie category not found", 404));
  if (await Movie.exists({ category: category._id })) {
    return next(new ErrorHandler("This category is used by a movie and cannot be deleted", 409));
  }
  await category.deleteOne();
  res.json({ success: true, message: "Movie category deleted successfully" });
});
