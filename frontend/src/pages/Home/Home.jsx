import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../../actions/movieAction";
import Loader from "../../component/layout/Loader/Loader";
import MovieHero from "../../component/movie/MovieHero";
import MovieRail from "../../component/movie/MovieRail";
import { toMovieViewModels } from "../../utils/movieViewModel";
import "./home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.movies);
  useEffect(() => { dispatch(getMovies({ limit: 100 })); }, [dispatch]);
  const list = useMemo(() => toMovieViewModels(movies), [movies]);
  const featured = list.filter((movie) => movie.showInBanner).slice(0, 6);
  const heroMovies = featured.length ? featured : list.slice(0, 6);
  const trending = [...list].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 14);
  const latest = [...list].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 14);
  const action = list.filter((movie) => movie.genres.some((genre) => /action|adventure/i.test(genre))).slice(0, 14);

  if (loading && !list.length) return <main className="movie-home-empty"><Loader /></main>;
  if (!list.length) return <main className="movie-home-empty"><h1>No movies yet</h1><p>{error || "Movies uploaded from the admin panel will appear here."}</p></main>;
  return <main className="movie-home"><MovieHero movies={heroMovies} /><div className="movie-home__rails">
    <MovieRail title="Trending Now" subtitle="What everyone is watching this week" movies={trending} />
    <MovieRail title="Latest Releases" subtitle="Fresh stories, ready to stream" movies={latest} />
    {action.length > 0 && <MovieRail title="Action & Adventure" subtitle="Big stakes and unforgettable journeys" movies={action} />}
  </div></main>;
};

export default Home;
