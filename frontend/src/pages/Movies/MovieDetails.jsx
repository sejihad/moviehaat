import { ArrowLeft, Calendar, Clock3, Play, Star } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getMovie, getMovies } from "../../actions/movieAction";
import MetaData from "../../component/layout/MetaData";
import { toMovieViewModel, toMovieViewModels } from "../../utils/movieViewModel";
import "./movieDetails.css";

const MovieDetails = () => {
  const { slug } = useParams(); const dispatch = useDispatch();
  const { movie: rawMovie, loading, error } = useSelector((state) => state.movieDetails);
  const { movies } = useSelector((state) => state.movies);
  useEffect(() => { dispatch(getMovie(slug)); dispatch(getMovies({ limit: 6 })); }, [dispatch, slug]);
  const movie = useMemo(() => rawMovie ? toMovieViewModel(rawMovie) : null, [rawMovie]);
  const related = useMemo(() => toMovieViewModels(movies).filter((item) => item.id !== slug).slice(0, 5), [movies, slug]);
  if (loading || (!movie && !error)) return <main className="movie-detail-empty"><p>Loading movie...</p></main>;
  if (!movie) return <main className="movie-detail-empty"><h1>Movie not found</h1><p>{error}</p><Link to="/movies">Back to movies</Link></main>;
  const seoDescription = movie.seoDescription || movie.description?.replace(/<[^>]*>/g, " ").slice(0, 160);

  return <main className="movie-detail">
    <MetaData title={movie.seoTitle || `${movie.title} | MovieHaat`} description={seoDescription} keywords={movie.seoKeywords || movie.tags?.join(", ")} image={movie.backdrop || movie.image} type="video.movie"/>
    <section className="movie-detail__hero"><div className="movie-detail__backdrop" style={{ backgroundImage: `url(${movie.backdrop})` }}/><div className="movie-detail__shade"/><div className="container movie-detail__nav"><Link to="/movies"><ArrowLeft size={18}/> All movies</Link></div><div className="container movie-detail__content"><div className="movie-detail__poster"><img src={movie.image} alt={`${movie.title} poster`}/><span>{movie.quality}</span></div><div className="movie-detail__copy"><p className="movie-detail__kicker">MovieHaat original</p><h1>{movie.title}</h1><div className="movie-detail__meta"><strong><Star size={16} fill="currentColor"/> {movie.rating}<small>/10</small></strong><span><Calendar size={16}/>{movie.year}</span><span><Clock3 size={16}/>{movie.duration}</span><span className="movie-detail__age">{movie.maturity}</span></div><div className="movie-detail__genres">{movie.genres.map((genre) => <span key={genre}>{genre}</span>)}</div><p className="movie-detail__description">{movie.description}</p><div className="movie-detail__actions"><Link to={`/watch/${movie.id}`} className="movie-detail__watch" aria-label={`Watch ${movie.title}`} title="Watch movie"><Play size={23} fill="currentColor"/></Link></div></div></div></section>
    <section className="container movie-detail__body"><div className="movie-detail__story"><p className="movie-detail__section-label">The story</p><h2>About the movie</h2><p>{movie.description}</p></div><dl className="movie-detail__facts"><div><dt>Director</dt><dd>{movie.director || "Not available"}</dd></div><div><dt>Cast</dt><dd>{movie.cast.join(", ") || "Not available"}</dd></div><div><dt>Release date</dt><dd>{movie.releaseDateLabel}</dd></div><div><dt>Language</dt><dd>{movie.language}</dd></div></dl></section>
    {related.length > 0 && <section className="container movie-detail__related"><div className="movie-detail__related-head"><div><p className="movie-detail__section-label">Keep watching</p><h2>You may also like</h2></div><Link to="/movies">View all</Link></div><div className="movie-detail__grid">{related.map((item) => <Link to={`/movies/${item.id}`} className="movie-detail__card" key={item.id}><div><img src={item.image} alt={`${item.title} poster`}/><span><Play size={17} fill="currentColor"/></span></div><h3>{item.title}</h3><p>{item.year} · {item.genres[0]}</p></Link>)}</div></section>}
  </main>;
};

export default MovieDetails;
