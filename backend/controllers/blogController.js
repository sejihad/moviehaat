const slugify = require("slugify");
const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const uploadToS3 = require("../config/uploadToS3");
const deleteFromS3 = require("../config/deleteFromS3");

const uploadImage = async (file) => {
  if (Array.isArray(file) || !file?.mimetype?.startsWith("image/")) {
    throw new Error("Please upload a single image file");
  }
  const uploaded = await uploadToS3(file, "blogs/images");
  return { public_id: uploaded.key, url: uploaded.url };
};

const uniqueSlug = async (title, excludeId) => {
  const base = slugify(title, { lower: true, strict: true }) || "blog";
  let slug = base;
  let suffix = 1;
  while (await Blog.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

exports.createBlog = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.title || !req.body.desc || !req.files?.image) {
    return next(new ErrorHandler("Title, description and image are required", 400));
  }
  let image;
  try {
    image = await uploadImage(req.files.image);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
  const blog = await Blog.create({
    title: req.body.title,
    desc: req.body.desc,
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
    seoKeywords: req.body.seoKeywords,
    slug: await uniqueSlug(req.body.title),
    image,
    author: req.user.id,
  });
  res.status(201).json({ success: true, message: "Blog created successfully", blog });
});

exports.getAllBlogs = catchAsyncErrors(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const filter = req.query.search ? { $text: { $search: req.query.search } } : {};
  const [blogs, total] = await Promise.all([
    Blog.find(filter).populate("author", "name avatar").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Blog.countDocuments(filter),
  ]);
  res.json({ success: true, blogs, total, page, pages: Math.ceil(total / limit) });
});

exports.getAdminBlogs = catchAsyncErrors(async (_req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, blogs });
});

exports.getBlogDetails = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name avatar");
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  res.json({ success: true, blog });
});

exports.getAdminBlogDetails = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  res.json({ success: true, blog });
});

exports.updateBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  if (req.body.title !== undefined) {
    blog.title = req.body.title;
    blog.slug = await uniqueSlug(req.body.title, blog._id);
  }
  if (req.body.desc !== undefined) blog.desc = req.body.desc;
  for (const field of ["seoTitle", "seoDescription", "seoKeywords"]) {
    if (req.body[field] !== undefined) blog[field] = req.body[field];
  }
  if (req.files?.image) {
    let image;
    try {
      image = await uploadImage(req.files.image);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
    const oldKey = blog.image?.public_id;
    blog.image = image;
    if (oldKey) await deleteFromS3(oldKey);
  }
  await blog.save();
  res.json({ success: true, message: "Blog updated successfully", blog });
});

exports.deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  if (blog.image?.public_id) await deleteFromS3(blog.image.public_id);
  await blog.deleteOne();
  res.json({ success: true, message: "Blog deleted successfully" });
});
