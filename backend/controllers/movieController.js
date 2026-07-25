const mongoose = require("mongoose");
const slugify = require("slugify");
const Movie = require("../models/movieModel");
const MovieCategory = require("../models/movieCategoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");
const { toYoutubeEmbedUrl } = require("../utils/youtube");

const parseArray = (value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value))
    return value
      .map(String)
      .map((v) => v.trim())
      .filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed))
      return parsed
        .map(String)
        .map((v) => v.trim())
        .filter(Boolean);
  } catch {}
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

const parseBoolean = (value) =>
  value === true || value === "true" || value === "1";
const asFiles = (file) => (file ? (Array.isArray(file) ? file : [file]) : []);
const normalizeQualities = (value) => {
  const aliases = {
    "4k": "4K",
    1080: "1080p",
    "1080p": "1080p",
    720: "720p",
    "720p": "720p",
  };
  return (parseArray(value) || []).map(
    (item) => aliases[item.toLowerCase()] || item,
  );
};

const imageFromUpload = async (file, folder) => {
  if (!file?.mimetype?.startsWith("image/"))
    throw new Error("Only image files are allowed");
  const uploaded = await uploadToS3(file, folder);
  return { public_id: uploaded.key, url: uploaded.url };
};

const uploadImages = async (files, folder) => {
  const uploaded = [];
  try {
    for (const file of files)
      uploaded.push(await imageFromUpload(file, folder));
    return uploaded;
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((image) => deleteFromS3(image.public_id)),
    );
    throw error;
  }
};

const uniqueSlug = async (title, excludeId) => {
  const base = slugify(title, { lower: true, strict: true }) || "movie";
  let slug = base;
  let suffix = 1;
  while (
    await Movie.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })
  ) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

const validCategory = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return MovieCategory.findById(id);
};

exports.createMovie = catchAsyncErrors(async (req, res, next) => {
  const { title, description, category, youtubeUrl, youtubeEmbedUrl } =
    req.body;
  const posterFiles = asFiles(req.files?.poster || req.files?.mainImage);
  if (
    !title ||
    !description ||
    !category ||
    !(youtubeUrl || youtubeEmbedUrl) ||
    posterFiles.length !== 1
  ) {
    return next(
      new ErrorHandler(
        "title, description, category, YouTube link and one poster are required",
        400,
      ),
    );
  }
  if (!(await validCategory(category)))
    return next(new ErrorHandler("Please select a valid movie category", 400));

  let embedUrl;
  try {
    embedUrl = toYoutubeEmbedUrl(youtubeUrl || youtubeEmbedUrl);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }

  const uploaded = [];
  try {
    const poster = (await uploadImages(posterFiles, "movies/posters"))[0];
    uploaded.push(poster);
    const backdropFiles = asFiles(req.files?.backdrop);
    if (backdropFiles.length > 1)
      throw new Error("Only one backdrop image is allowed");
    const backdrop = backdropFiles.length
      ? (await uploadImages(backdropFiles, "movies/backdrops"))[0]
      : null;
    if (backdrop) uploaded.push(backdrop);
    const extraImages = await uploadImages(
      asFiles(req.files?.extraImages),
      "movies/extra-images",
    );
    uploaded.push(...extraImages);

    const movie = await Movie.create({
      title: String(title).trim(),
      slug: await uniqueSlug(title),
      description,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      seoKeywords: req.body.seoKeywords,
      category,
      genres: parseArray(req.body.genres),
      tags: parseArray(req.body.tags),
      releaseDate: req.body.releaseDate,
      durationMinutes: req.body.durationMinutes,
      language: req.body.language,
      streamQualities: normalizeQualities(req.body.streamQualities),
      rating: req.body.rating === undefined ? 0 : req.body.rating,
      country: req.body.country,
      cast: parseArray(req.body.cast),
      director: req.body.director,
      youtubeEmbedUrl: embedUrl,
      poster,
      ...(backdrop && { backdrop }),
      extraImages,
      showInBanner: parseBoolean(req.body.showInBanner ?? req.body.featured),
      featured: parseBoolean(req.body.featured),
      published:
        req.body.published === undefined
          ? true
          : parseBoolean(req.body.published),
      createdBy: req.user.id,
    });
    await movie.populate("category", "name slug active");
    res
      .status(201)
      .json({ success: true, message: "Movie created successfully", movie });
  } catch (error) {
    console.log(error);
    await Promise.allSettled(
      uploaded.map((image) => deleteFromS3(image.public_id)),
    );
    next(error);
  }
});

exports.getMovies = catchAsyncErrors(async (req, res, next) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = { published: true };
  if (req.query.genre) filter.genres = req.query.genre;
  if (req.query.tag) filter.tags = String(req.query.tag).toLowerCase();
  if (req.query.language) filter.language = req.query.language;
  if (req.query.quality)
    filter.streamQualities = normalizeQualities(req.query.quality)[0];
  if (req.query.banner !== undefined)
    filter.showInBanner = parseBoolean(req.query.banner);
  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.category) {
    const category = mongoose.isValidObjectId(req.query.category)
      ? await MovieCategory.findById(req.query.category)
      : await MovieCategory.findOne({ slug: req.query.category });
    if (!category)
      return next(new ErrorHandler("Movie category not found", 404));
    filter.category = category._id;
  }
  const sortOptions = {
    latest: { releaseDate: -1, createdAt: -1 },
    recent: { createdAt: -1 },
    topRated: { rating: -1, createdAt: -1 },
  };
  const sort = sortOptions[req.query.sort] || {
    showInBanner: -1,
    createdAt: -1,
  };
  const [movies, total] = await Promise.all([
    Movie.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Movie.countDocuments(filter),
  ]);
  res.json({
    success: true,
    movies,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

exports.getMovie = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findOne({
    slug: req.params.slug,
    published: true,
  }).populate("category", "name slug");
  if (!movie) return next(new ErrorHandler("Movie not found", 404));
  res.json({ success: true, movie });
});

exports.getAdminMovies = catchAsyncErrors(async (req, res) => {
  const movies = await Movie.find()
    .populate("category", "name slug active")
    .sort({ createdAt: -1 });
  res.json({ success: true, movies });
});

exports.getAdminMovie = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).populate(
    "category",
    "name slug active",
  );
  if (!movie) return next(new ErrorHandler("Movie not found", 404));
  res.json({ success: true, movie });
});

exports.updateMovie = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return next(new ErrorHandler("Movie not found", 404));
  if (req.body.category !== undefined) {
    if (!(await validCategory(req.body.category)))
      return next(
        new ErrorHandler("Please select a valid movie category", 400),
      );
    movie.category = req.body.category;
  }

  const fields = [
    "description",
    "releaseDate",
    "language",
    "country",
    "director",
    "seoTitle",
    "seoDescription",
    "seoKeywords",
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined)
      movie[field] = req.body[field] || undefined;
  });
  if (req.body.title !== undefined) {
    const title = String(req.body.title).trim();
    if (!title)
      return next(new ErrorHandler("Movie title cannot be empty", 400));
    movie.title = title;
    movie.slug = await uniqueSlug(title, movie._id);
  }
  for (const field of ["durationMinutes", "rating"]) {
    if (req.body[field] !== undefined) movie[field] = Number(req.body[field]);
  }
  if (req.body.genres !== undefined) movie.genres = parseArray(req.body.genres);
  if (req.body.tags !== undefined) movie.tags = parseArray(req.body.tags);
  if (req.body.cast !== undefined) movie.cast = parseArray(req.body.cast);
  if (req.body.streamQualities !== undefined)
    movie.streamQualities = normalizeQualities(req.body.streamQualities);
  if (req.body.showInBanner !== undefined)
    movie.showInBanner = parseBoolean(req.body.showInBanner);
  if (req.body.featured !== undefined)
    movie.featured = parseBoolean(req.body.featured);
  if (req.body.published !== undefined)
    movie.published = parseBoolean(req.body.published);
  if (
    req.body.youtubeUrl !== undefined ||
    req.body.youtubeEmbedUrl !== undefined
  ) {
    try {
      movie.youtubeEmbedUrl = toYoutubeEmbedUrl(
        req.body.youtubeUrl || req.body.youtubeEmbedUrl,
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }

  const newImages = [];
  const oldImagesToDelete = [];
  try {
    for (const field of ["poster", "backdrop"]) {
      const files = asFiles(
        req.files?.[field] ||
          (field === "poster" ? req.files?.mainImage : null),
      );
      if (files.length > 1)
        throw new Error(`Only one ${field} image is allowed`);
      if (files.length === 1) {
        const image = (await uploadImages(files, `movies/${field}s`))[0];
        newImages.push(image);
        if (movie[field]?.public_id)
          oldImagesToDelete.push(movie[field].public_id);
        movie[field] = image;
      }
    }
    const extras = await uploadImages(
      asFiles(req.files?.extraImages),
      "movies/extra-images",
    );
    newImages.push(...extras);
    movie.extraImages.push(...extras);

    const removeIds = parseArray(req.body.removeExtraImageIds) || [];
    if (removeIds.length) {
      const removing = movie.extraImages.filter((image) =>
        removeIds.includes(image.public_id),
      );
      oldImagesToDelete.push(...removing.map((image) => image.public_id));
      movie.extraImages = movie.extraImages.filter(
        (image) => !removeIds.includes(image.public_id),
      );
    }
    if (parseBoolean(req.body.removeBackdrop) && movie.backdrop?.public_id) {
      oldImagesToDelete.push(movie.backdrop.public_id);
      movie.backdrop = undefined;
    }

    await movie.save();
    await Promise.allSettled(oldImagesToDelete.map(deleteFromS3));
    await movie.populate("category", "name slug active");
    res.json({ success: true, message: "Movie updated successfully", movie });
  } catch (error) {
    await Promise.allSettled(
      newImages.map((image) => deleteFromS3(image.public_id)),
    );
    next(error);
  }
});

exports.deleteMovie = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return next(new ErrorHandler("Movie not found", 404));
  const keys = [
    movie.poster?.public_id,
    movie.backdrop?.public_id,
    ...movie.extraImages.map((image) => image.public_id),
  ].filter(Boolean);
  await Promise.allSettled(keys.map(deleteFromS3));
  await movie.deleteOne();
  res.json({ success: true, message: "Movie deleted successfully" });
});
