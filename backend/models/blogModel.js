const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    seoDescription: { type: String, trim: true, maxlength: 180 },
    seoKeywords: { type: String, trim: true, maxlength: 500 },
    desc: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    author: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

blogSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: "text", desc: "text" });

module.exports = mongoose.model("Blog", blogSchema);
