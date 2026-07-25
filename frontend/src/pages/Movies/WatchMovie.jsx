import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getMovie } from "../../actions/movieAction";
import MetaData from "../../component/layout/MetaData";
import { toMovieViewModel } from "../../utils/movieViewModel";
import "./watchMovie.css";

const WatchMovie = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { movie: rawMovie, loading, error } = useSelector((state) => state.movieDetails);
  const movie = useMemo(() => rawMovie ? toMovieViewModel(rawMovie) : null, [rawMovie]);

  useEffect(() => {
    dispatch(getMovie(slug));
  }, [dispatch, slug]);

  if (loading || (!movie && !error)) return <main className="watch-screen"><p>Loading movie...</p></main>;
  if (!movie) return <main className="watch-screen watch-screen--state"><h1>Movie unavailable</h1><p>{error}</p><Link to="/movies">Back to movies</Link></main>;

  return <main className="watch-screen">
    <MetaData title={`Watch ${movie.title}`} description={`Watch ${movie.title} on MovieHaat.`} image={movie.backdrop || movie.image} noIndex />
    <Link to={`/movies/${movie.id}`} className="watch-screen__back"><ArrowLeft size={18}/> Back</Link>
    <iframe src={movie.youtubeEmbedUrl} title={`${movie.title} player`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />
  </main>;
};

export default WatchMovie;
