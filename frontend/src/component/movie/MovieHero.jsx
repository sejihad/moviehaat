import { ChevronLeft, ChevronRight, Info, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MovieHero = ({ movies }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const changeSlide = useCallback(
    (direction) => {
      setActiveIndex((current) =>
        direction === "next"
          ? (current + 1) % movies.length
          : (current - 1 + movies.length) % movies.length
      );
    },
    [movies.length]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") changeSlide("next");
      if (event.key === "ArrowLeft") changeSlide("previous");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSlide]);

  useEffect(() => {
    const interval = window.setInterval(() => changeSlide("next"), 7000);
    return () => window.clearInterval(interval);
  }, [changeSlide]);

  const movie = movies[activeIndex];

  return (
    <section className="movie-hero" aria-roledescription="carousel">
      {movies.map((item, index) => (
        <div
          key={item.id}
          className={`movie-hero__backdrop ${index === activeIndex ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden={index !== activeIndex}
        />
      ))}
      <div className="movie-hero__shade" />

      <div className="container movie-hero__content">
        <div className="movie-hero__copy" key={movie.id}>
          <p className="movie-hero__eyebrow">
            <span /> {movie.eyebrow}
          </p>
          <h1>{movie.title}</h1>
          <div className="movie-hero__meta">
            <span className="movie-hero__rating"><Star size={15} fill="currentColor" /> {movie.rating}</span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <span className="movie-hero__quality">{movie.quality}</span>
          </div>
          <div className="movie-hero__genres">
            {movie.genres.map((genre) => <span key={genre}>{genre}</span>)}
          </div>
          <p className="movie-hero__description">{movie.description}</p>
          <div className="movie-hero__actions">
            <Link className="movie-hero__secondary" to={`/movies/${movie.id}`}>
              <Info size={18} /> More info
            </Link>
          </div>
        </div>

        <div className="movie-hero__poster-wrap">
          <span className="movie-hero__poster-glow" />
          <img src={movie.poster || movie.image} alt={`${movie.title} poster`} className="movie-hero__poster" />
        </div>
      </div>

      <button className="movie-hero__arrow movie-hero__arrow--left" onClick={() => changeSlide("previous")} aria-label="Previous featured movie">
        <ChevronLeft />
      </button>
      <button className="movie-hero__arrow movie-hero__arrow--right" onClick={() => changeSlide("next")} aria-label="Next featured movie">
        <ChevronRight />
      </button>
      <div className="movie-hero__dots">
        {movies.map((item, index) => (
          <button key={item.id} className={index === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show ${item.title}`} />
        ))}
      </div>
    </section>
  );
};

export default MovieHero;
