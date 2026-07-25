import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const MovieRail = ({ title, subtitle, movies }) => {
  const railRef = useRef(null);

  const scroll = (direction) => {
    railRef.current?.scrollBy({
      left: direction === "next" ? railRef.current.clientWidth * 0.8 : -railRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="movie-rail container">
      <div className="movie-rail__heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="movie-rail__controls">
          <button onClick={() => scroll("previous")} aria-label={`Scroll ${title} left`}><ChevronLeft /></button>
          <button onClick={() => scroll("next")} aria-label={`Scroll ${title} right`}><ChevronRight /></button>
        </div>
      </div>

      <div className="movie-rail__track scrollbar-hide" ref={railRef}>
        {movies.map((movie) => (
          <Link to={`/movies/${movie.movieId || movie.id}`} className="movie-card" key={movie.id}>
            <div className="movie-card__image-wrap">
              <img src={movie.image} alt={`${movie.title} poster`} loading="lazy" />
              <span className="movie-card__rating"><Star size={12} fill="currentColor" /> {movie.rating}</span>
              <div className="movie-card__overlay">
                <button className="movie-card__play" aria-label={`Play ${movie.title}`}><Play fill="currentColor" /></button>
              </div>
            </div>
            <div className="movie-card__body">
              <h3>{movie.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MovieRail;
