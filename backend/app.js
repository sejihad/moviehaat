const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const user = require("./routes/userRoute");
const movie = require("./routes/movieRoute");
const movieCategory = require("./routes/movieCategoryRoute");
const blog = require("./routes/blogRoute");
// const { cdnJsonReplacer } = require("./utils/cdnUrl");

dotenv.config();
require("./config/passport");

// CDN URL conversion is temporarily disabled so image URLs are called directly.
// app.set("json replacer", cdnJsonReplacer);

app.use(passport.initialize());
// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ✅ File Upload Middleware Fix
app.use(fileUpload());

// ✅ CORS Middleware Fix
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://moviehaat.com",
      "https://www.moviehaat.com",
    ],
    credentials: true,
  })
);

// API Routes

app.use("/api/v1", user);
app.use("/api/v1", movie);
app.use("/api/v1", movieCategory);
app.use("/api/v1", blog);
// Error Middleware
app.use(errorMiddleware);

module.exports = app;
