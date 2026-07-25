import { Edit3, Film, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMovie, getAdminMovies, resetMovieMutation } from "../../actions/movieAction";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";
import "./adminMovies.css";

const AllMovies = () => {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.adminMovies);
  const mutation = useSelector((state) => state.movieMutation);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  useEffect(() => { dispatch(getAdminMovies()); }, [dispatch]);
  useEffect(() => {
    if (mutation.success) { toast.success("Movie deleted"); dispatch(resetMovieMutation()); dispatch(getAdminMovies()); }
    if (mutation.error) toast.error(mutation.error);
  }, [mutation.success, mutation.error, dispatch]);
  const filtered = useMemo(() => movies.filter((movie) => {
    const matchesText = `${movie.title} ${movie.category?.name || ""} ${movie.language || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || (status === "published" ? movie.published : !movie.published);
    return matchesText && matchesStatus;
  }), [movies, search, status]);
  const remove = (id) => { if (window.confirm("Delete this movie and all its images?")) dispatch(deleteMovie(id)); };

  return <div className="admin-shell"><Sidebar /><main className="admin-content"><MetaData title="Movies | Admin" />
    <div className="admin-title"><div><p>Content</p><h1>Movies <span className="title-count">{movies.length}</span></h1></div><Link to="/admin/movie/new" className="admin-primary"><Plus size={18} />Add movie</Link></div>
    <div className="admin-filters"><label><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search movies..." /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All status</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
    {loading ? <div className="admin-loading">Loading movies...</div> : error ? <p className="admin-error">{error}</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Movie</th><th>Category</th><th>Quality</th><th>Rating</th><th>Placement</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map((movie) => <tr key={movie._id}><td><div className="movie-cell">{movie.poster?.url ? <img src={movie.poster.url} alt="" /> : <Film />}<div><strong>{movie.title}</strong><span>{movie.language || "No language"} · {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "No date"}</span></div></div></td><td>{movie.category?.name || <span className="missing-value">Missing</span>}</td><td><div className="quality-list">{movie.streamQualities?.map((quality) => <span key={quality}>{quality}</span>)}</div></td><td><strong>{movie.rating ?? 0}/10</strong></td><td>{movie.showInBanner ? <span className="status banner">Banner</span> : "—"}</td><td><span className={`status ${movie.published ? "live" : "draft"}`}>{movie.published ? "Published" : "Draft"}</span></td><td><div className="table-actions"><Link title="Edit" to={`/admin/movie/${movie._id}`}><Edit3 size={17} /></Link><button title="Delete" onClick={() => remove(movie._id)} disabled={mutation.loading}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="empty-admin">No matching movies found.</p>}</div>}
  </main></div>;
};
export default AllMovies;
