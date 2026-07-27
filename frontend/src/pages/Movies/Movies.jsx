import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { getMovies } from "../../actions/movieAction";
import { toMovieViewModels } from "../../utils/movieViewModel";
import "./movies.css";

const Movies = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { movies: apiMovies, loading, error } = useSelector((state) => state.movies);
  const categoryRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All Movies");
  const searchQuery = (searchParams.get("search") || "").trim();
  useEffect(() => {
    setActiveCategory("All Movies");
    dispatch(getMovies({ limit: 100, ...(searchQuery && { search: searchQuery }) }));
  }, [dispatch, searchQuery]);
  const movies = useMemo(() => toMovieViewModels(apiMovies), [apiMovies]);
  const categories = useMemo(() => ["All Movies", ...new Set(movies.flatMap((movie) => [movie.category?.name, ...movie.genres]).filter(Boolean))], [movies]);
  const visibleMovies = activeCategory === "All Movies" ? movies : movies.filter((movie) => movie.category?.name === activeCategory || movie.genres.includes(activeCategory));
  const scrollCategories = (direction) => categoryRef.current?.scrollBy({ left: direction === "next" ? 360 : -360, behavior: "smooth" });

  return <main className="movies-page"><section className="movie-categories" aria-label="Movie categories"><div className="container movie-categories__inner">
    <button type="button" className="movie-categories__arrow" onClick={() => scrollCategories("previous")} aria-label="Show previous categories"><ChevronLeft /></button>
    <div className="movie-categories__track scrollbar-hide" ref={categoryRef}>{categories.map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? "is-active" : ""}>{category}</button>)}</div>
    <button type="button" className="movie-categories__arrow" onClick={() => scrollCategories("next")} aria-label="Show more categories"><ChevronRight /></button>
  </div></section><section className="container movies-library"><header className="movies-library__heading"><div><p>{searchQuery ? "Search results" : "Explore our collection"}</p><h1>{searchQuery ? `Results for “${searchQuery}”` : activeCategory}</h1></div><span>{visibleMovies.length} movies</span></header>
    {loading && !movies.length ? <div className="movie-state">Loading movies...</div> : error && !movies.length ? <div className="movie-state">{error}</div> : !visibleMovies.length ? <div className="movie-state">{searchQuery ? `No movies found for “${searchQuery}”.` : "No movies found in this category."}</div> : <div className="movies-grid">{visibleMovies.map((movie) => <Link to={`/movies/${movie.id}`} className="library-movie-card" key={movie.id}><div className="library-movie-card__poster"><img src={movie.image} alt={`${movie.title} poster`} loading="lazy"/><span className="library-movie-card__rating"><Star size={12} fill="currentColor"/> {movie.rating}</span><div className="library-movie-card__overlay"><span><Play size={21} fill="currentColor"/></span></div></div><h2>{movie.title}</h2></Link>)}</div>}
  </section></main>;
};

export default Movies;
