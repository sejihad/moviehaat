const mongoose = require("mongoose");
const slugify = require("slugify");

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    seoDescription: { type: String, trim: true, maxlength: 180 },
    seoKeywords: { type: String, trim: true, maxlength: 500 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "MovieCategory",
      required: true,
      index: true,
    },
    genres: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true, lowercase: true }],
    releaseDate: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    language: { type: String, required: true, trim: true },
    streamQualities: [
      {
        type: String,
        enum: ["4K", "1080p", "720p"],
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 10 },
    country: { type: String, trim: true },
    cast: [{ type: String, trim: true }],
    director: { type: String, trim: true },
    youtubeEmbedUrl: { type: String, required: true },
    poster: { type: imageSchema, required: true },
    backdrop: imageSchema,
    extraImages: { type: [imageSchema], default: [] },
    showInBanner: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

movieSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

movieSchema.index({ published: 1, createdAt: -1 });
movieSchema.index({ title: "text", description: "text", genres: "text", tags: "text" });

module.exports = mongoose.model("Movie", movieSchema);
