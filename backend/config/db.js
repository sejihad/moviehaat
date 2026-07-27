const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL).then(async () => {
  console.log("DB Connection successfull");

  const Movie = require("../models/movieModel");
  const indexes = await Movie.collection.indexes();
  const oldTextIndex = indexes.find(
    (index) =>
      Object.values(index.key).includes("text") &&
      index.language_override !== "searchLanguage",
  );

  if (oldTextIndex) {
    await Movie.collection.dropIndex(oldTextIndex.name);
  }
  await Movie.createIndexes();
});
