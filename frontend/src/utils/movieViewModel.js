const formatDuration = (minutes) => {
  const value = Number(minutes);
  if (!value) return "—";
  const hours = Math.floor(value / 60);
  const remainder = value % 60;
  return hours ? `${hours}h ${remainder ? `${remainder}m` : ""}`.trim() : `${remainder}m`;
};

export const toMovieViewModel = (movie = {}) => ({
  ...movie,
  id: movie.slug || movie._id,
  image: movie.poster?.url || "",
  poster: movie.poster?.url || "",
  backdrop: movie.backdrop?.url || movie.poster?.url || "",
  year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "—",
  releaseDateLabel: movie.releaseDate ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(movie.releaseDate)) : "—",
  duration: formatDuration(movie.durationMinutes),
  maturity: movie.maturity || "PG",
  quality: movie.streamQualities?.[0] || "HD",
  genres: movie.genres?.length ? movie.genres : [movie.category?.name].filter(Boolean),
  cast: movie.cast || [],
  eyebrow: movie.showInBanner ? "Featured premiere" : "Now streaming",
});

export const toMovieViewModels = (movies = []) => movies.map(toMovieViewModel);
