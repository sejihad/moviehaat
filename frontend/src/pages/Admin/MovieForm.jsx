import { ImagePlus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createMovie, getAdminMovie, resetMovieMutation, updateMovie } from "../../actions/movieAction";
import { getAdminMovieCategories } from "../../actions/movieCategoryAction";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";
import "./adminMovies.css";
import "./adminSeo.css";

const initial = {
  title: "", category: "", description: "", youtubeUrl: "", genres: "", tags: "",
  cast: "", releaseDate: "", durationMinutes: "", language: "", country: "",
  director: "", rating: "0", showInBanner: false, published: true,
  seoTitle: "", seoDescription: "", seoKeywords: "",
};

const MovieForm = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.movieMutation);
  const [values, setValues] = useState(initial);
  const [qualities, setQualities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [poster, setPoster] = useState(null);
  const [backdrop, setBackdrop] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [removedExtraIds, setRemovedExtraIds] = useState([]);
  const [previews, setPreviews] = useState({ poster: "", backdrop: "", extras: [] });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminMovieCategories(), editing ? getAdminMovie(id) : Promise.resolve(null)])
      .then(([categoryList, movie]) => {
        setCategories(categoryList);
        if (!movie) return;
        setValues({
          title: movie.title || "", category: movie.category?._id || movie.category || "",
          description: movie.description || "", youtubeUrl: movie.youtubeEmbedUrl || "",
          genres: movie.genres?.join(", ") || "", tags: movie.tags?.join(", ") || "",
          cast: movie.cast?.join(", ") || "", releaseDate: movie.releaseDate?.slice(0, 10) || "",
          durationMinutes: movie.durationMinutes || "", language: movie.language || "",
          country: movie.country || "", director: movie.director || "", rating: movie.rating ?? 0,
          showInBanner: Boolean(movie.showInBanner),
          published: Boolean(movie.published), seoTitle: movie.seoTitle || "",
          seoDescription: movie.seoDescription || "", seoKeywords: movie.seoKeywords || "",
        });
        setQualities(movie.streamQualities || []);
        setPreviews({ poster: movie.poster?.url || "", backdrop: movie.backdrop?.url || "", extras: movie.extraImages || [] });
      })
      .catch((requestError) => toast.error(requestError.response?.data?.message || "Could not load movie form"))
      .finally(() => setPageLoading(false));
  }, [editing, id]);

  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success(editing ? "Movie updated" : "Movie added");
      dispatch(resetMovieMutation());
      navigate("/admin/movies");
    }
  }, [error, success, editing, dispatch, navigate]);

  const activeCategories = useMemo(() => categories.filter((category) => category.active || category._id === values.category), [categories, values.category]);
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const chooseSingle = (name, setter) => (event) => {
    const selected = event.target.files[0];
    if (!selected) return;
    setter(selected);
    setPreviews((current) => ({ ...current, [name]: URL.createObjectURL(selected) }));
  };
  const chooseExtras = (event) => {
    const files = [...event.target.files];
    setExtraImages((current) => [...current, ...files]);
    setPreviews((current) => ({ ...current, extras: [...current.extras, ...files.map((file) => ({ url: URL.createObjectURL(file), local: true, name: file.name }))] }));
  };
  const removeExtra = (image, index) => {
    if (image.public_id) setRemovedExtraIds((current) => [...current, image.public_id]);
    if (image.local) setExtraImages((current) => current.filter((_, fileIndex) => fileIndex !== previews.extras.slice(0, index).filter((item) => item.local).length));
    setPreviews((current) => ({ ...current, extras: current.extras.filter((_, imageIndex) => imageIndex !== index) }));
  };
  const toggleQuality = (quality) => setQualities((current) => current.includes(quality) ? current.filter((item) => item !== quality) : [...current, quality]);

  const submit = async (event) => {
    event.preventDefault();
    if (!editing && !poster) return toast.error("Main poster is required");
    if (!qualities.length) return toast.error("Select at least one stream quality");
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => form.append(key, value));
    form.append("streamQualities", JSON.stringify(qualities));
    form.append("removeExtraImageIds", JSON.stringify(removedExtraIds));
    if (poster) form.append("poster", poster);
    if (backdrop) form.append("backdrop", backdrop);
    extraImages.forEach((image) => form.append("extraImages", image));
    try { await dispatch(editing ? updateMovie(id, form) : createMovie(form)); } catch { return; }
  };

  return <div className="admin-shell"><Sidebar /><main className="admin-content"><MetaData title={`${editing ? "Edit" : "Add"} Movie | Admin`} />
    <div className="admin-title"><div><p>Movie library</p><h1>{editing ? "Edit movie" : "Add a new movie"}</h1></div></div>
    {pageLoading ? <div className="admin-loading">Loading movie form...</div> : <form className="movie-admin-form" onSubmit={submit}>
      <section><h2>Movie information</h2><div className="form-grid">
        <label className="wide">Movie name<input name="title" value={values.title} onChange={change} required /></label>
        <label>Category<select name="category" value={values.category} onChange={change} required><option value="">Select category</option>{activeCategories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select><small>Create categories from Movie Categories first.</small></label>
        <label>Language<input name="language" value={values.language} onChange={change} required placeholder="Bangla, English..." /></label>
        <label className="wide">Description<textarea name="description" rows="6" value={values.description} onChange={change} required /></label>
        <label className="wide">YouTube embed URL<input name="youtubeUrl" value={values.youtubeUrl} onChange={change} placeholder="https://www.youtube.com/embed/B9VRvOKKwfs?list=..." required /><small>Paste only the URL from the iframe src attribute, not the full iframe code.</small></label>
        <label>Genres<input name="genres" value={values.genres} onChange={change} placeholder="Action, Drama" /></label>
        <label>Tags<input name="tags" value={values.tags} onChange={change} placeholder="latest, recently, trending" /></label>
        <label>Release date<input name="releaseDate" type="date" value={values.releaseDate} onChange={change} required /></label>
        <label>Duration (minutes)<input name="durationMinutes" type="number" min="1" value={values.durationMinutes} onChange={change} required /></label>
        <label>Rating (0–10)<input name="rating" type="number" min="0" max="10" step="0.1" value={values.rating} onChange={change} /></label>
        <label>Country<input name="country" value={values.country} onChange={change} /></label>
        <label>Director<input name="director" value={values.director} onChange={change} /></label>
        <label className="wide">Cast<input name="cast" value={values.cast} onChange={change} placeholder="Actor one, Actor two" /></label>
        <fieldset className="wide quality-picker"><legend>Stream quality</legend>{["4K", "1080p", "720p"].map((quality) => <button type="button" key={quality} className={qualities.includes(quality) ? "selected" : ""} onClick={() => toggleQuality(quality)}>{quality}</button>)}</fieldset>
        <div className="wide movie-seo-heading"><h2>SEO settings</h2><p>Optional search and social sharing information.</p></div>
        <label className="wide">SEO title<input name="seoTitle" value={values.seoTitle} onChange={change} maxLength="70" placeholder="Search result title"/><small>{values.seoTitle.length}/70</small></label>
        <label className="wide">SEO description<textarea name="seoDescription" value={values.seoDescription} onChange={change} maxLength="180" rows="3" placeholder="Short search result description"/><small>{values.seoDescription.length}/180</small></label>
        <label className="wide">SEO keywords<input name="seoKeywords" value={values.seoKeywords} onChange={change} placeholder="movie, streaming, action"/></label>
      </div></section>
      <aside><h2>Artwork & status</h2>
        <label className="upload-box poster">{previews.poster ? <img src={previews.poster} alt="Poster preview" /> : <ImagePlus />}<span>Choose main poster</span><input type="file" accept="image/*" onChange={chooseSingle("poster", setPoster)} /></label>
        <label className="upload-box backdrop">{previews.backdrop ? <img src={previews.backdrop} alt="Backdrop preview" /> : <ImagePlus />}<span>Choose backdrop</span><input type="file" accept="image/*" onChange={chooseSingle("backdrop", setBackdrop)} /></label>
        <label className="extra-upload"><ImagePlus size={18} /> Add extra images<input type="file" accept="image/*" multiple onChange={chooseExtras} /></label>
        {previews.extras.length > 0 && <div className="extra-preview-grid">{previews.extras.map((image, index) => <div key={`${image.public_id || image.name}-${index}`}><img src={image.url} alt="Extra" /><button type="button" onClick={() => removeExtra(image, index)}><Trash2 size={14} /></button></div>)}</div>}
        <label className="switch-row"><span>Published</span><input type="checkbox" name="published" checked={values.published} onChange={change} /></label>
        <label className="switch-row"><span>Show in banner</span><input type="checkbox" name="showInBanner" checked={values.showInBanner} onChange={change} /></label>
        <button className="admin-primary" disabled={loading}><Save size={18} />{loading ? "Saving..." : "Save movie"}</button>
        <button type="button" className="admin-secondary" onClick={() => navigate("/admin/movies")}><X size={18} />Cancel</button>
      </aside>
    </form>}
  </main></div>;
};

export default MovieForm;
