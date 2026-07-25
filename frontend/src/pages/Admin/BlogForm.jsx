import { ImagePlus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, createBlog, getAdminBlogDetails, updateBlog } from "../../actions/blogAction";
import MetaData from "../../component/layout/MetaData";
import RichTextEditor from "../../component/RichTextEditor";
import { NEW_BLOG_RESET, UPDATE_BLOG_RESET } from "../../constants/blogContants";
import Sidebar from "./Sidebar";
import "./adminBlog.css";

const empty = { title: "", desc: "", seoTitle: "", seoDescription: "", seoKeywords: "" };
const isEmptyHtml = (html) => !html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();

const BlogForm = ({ editing = false }) => {
  const dispatch = useDispatch(); const navigate = useNavigate(); const { id } = useParams();
  const details = useSelector((state) => state.blogDetails);
  const mutation = useSelector((state) => editing ? state.blog : state.newBlog);
  const [values, setValues] = useState(empty); const [image, setImage] = useState(null); const [preview, setPreview] = useState("");
  useEffect(() => { if (editing) dispatch(getAdminBlogDetails(id)); }, [dispatch, editing, id]);
  useEffect(() => { const blog = details.blog; if (editing && blog?._id === id) { setValues({ title: blog.title || "", desc: blog.desc || "", seoTitle: blog.seoTitle || "", seoDescription: blog.seoDescription || "", seoKeywords: blog.seoKeywords || "" }); setPreview(blog.image?.url || ""); } }, [details.blog, editing, id]);
  useEffect(() => { if (mutation.error) { toast.error(mutation.error); dispatch(clearErrors()); } if (editing ? mutation.isUpdated : mutation.success) { toast.success(editing ? "Blog updated" : "Blog created"); dispatch({ type: editing ? UPDATE_BLOG_RESET : NEW_BLOG_RESET }); navigate("/admin/blogs"); } }, [dispatch, editing, mutation.error, mutation.isUpdated, mutation.success, navigate]);
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const selectImage = (event) => { const file = event.target.files[0]; if (!file) return; if (!file.type.startsWith("image/")) return toast.error("Only image files are allowed"); setImage(file); setPreview(URL.createObjectURL(file)); };
  const submit = (event) => { event.preventDefault(); if (isEmptyHtml(values.desc)) return toast.error("Blog content is required"); if (!editing && !image) return toast.error("Featured image is required"); const data = new FormData(); Object.entries(values).forEach(([key, value]) => data.set(key, value)); if (image) data.append("image", image); dispatch(editing ? updateBlog(id, data) : createBlog(data)); };
  return <div className="admin-shell"><Sidebar/><main className="admin-content"><MetaData title={`${editing ? "Edit" : "Add"} Blog | Admin`}/><div className="admin-title"><div><p>Journal</p><h1>{editing ? "Edit blog" : "Create blog"}</h1></div></div>
    <form className="blog-admin-form" onSubmit={submit}><section><h2>Article content</h2><div className="form-grid"><label className="wide">Blog title<input name="title" value={values.title} onChange={change} required maxLength="200"/></label><label className="wide">Main description / content<RichTextEditor value={values.desc} onChange={(desc) => setValues((current) => ({ ...current, desc }))} placeholder="Write and customize your article..."/></label></div>
      <div className="seo-panel"><div><h2>SEO settings</h2><p>Optional search and social sharing information.</p></div><div className="form-grid"><label className="wide">SEO title<input name="seoTitle" value={values.seoTitle} onChange={change} maxLength="70" placeholder="Search result title"/><small>{values.seoTitle.length}/70</small></label><label className="wide">SEO description<textarea name="seoDescription" value={values.seoDescription} onChange={change} maxLength="180" rows="3" placeholder="Short search result description"/><small>{values.seoDescription.length}/180</small></label><label className="wide">SEO keywords<input name="seoKeywords" value={values.seoKeywords} onChange={change} placeholder="movie review, cinema, streaming"/></label></div></div>
    </section><aside><h2>Featured image</h2><label className="blog-upload">{preview ? <img src={preview} alt="Blog preview"/> : <><ImagePlus/><span>Choose image</span></>}<input type="file" accept="image/*" onChange={selectImage}/></label><button className="admin-primary" disabled={mutation.loading}><Save size={18}/>{mutation.loading ? "Saving..." : "Save blog"}</button><button type="button" className="admin-secondary" onClick={() => navigate("/admin/blogs")}><X size={18}/>Cancel</button></aside>
    </form></main></div>;
};

export default BlogForm;
