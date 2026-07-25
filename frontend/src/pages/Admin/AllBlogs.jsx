import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, deleteBlog, getAdminBlog } from "../../actions/blogAction";
import MetaData from "../../component/layout/MetaData";
import { DELETE_BLOG_RESET } from "../../constants/blogContants";
import Sidebar from "./Sidebar";

const AllBlogs = () => {
  const dispatch = useDispatch(); const { blogs, error, loading } = useSelector((state) => state.blogs); const mutation = useSelector((state) => state.blog);
  useEffect(() => { dispatch(getAdminBlog()); }, [dispatch]);
  useEffect(() => { if (error || mutation.error) { toast.error(error || mutation.error); dispatch(clearErrors()); } if (mutation.isDeleted) { toast.success("Blog deleted"); dispatch({ type: DELETE_BLOG_RESET }); dispatch(getAdminBlog()); } }, [dispatch, error, mutation.error, mutation.isDeleted]);
  const remove = (id) => { if (window.confirm("Delete this blog permanently?")) dispatch(deleteBlog(id)); };
  return <div className="admin-shell"><Sidebar/><main className="admin-content"><MetaData title="Blogs | Admin"/><div className="admin-title"><div><p>Journal</p><h1>All blogs <span className="title-count">{blogs?.length || 0}</span></h1></div><Link className="admin-primary" to="/admin/blog/new"><Plus size={18}/>Add blog</Link></div>
    {loading ? <div className="admin-loading">Loading blogs...</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Article</th><th>SEO</th><th>Created</th><th>Actions</th></tr></thead><tbody>{blogs?.map((blog) => <tr key={blog._id}><td><div className="movie-cell"><img src={blog.image?.url} alt=""/><div><strong>{blog.title}</strong><span>{blog.slug}</span></div></div></td><td><span className={`status ${blog.seoTitle || blog.seoDescription ? "live" : "draft"}`}>{blog.seoTitle || blog.seoDescription ? "Configured" : "Default"}</span></td><td>{new Date(blog.createdAt).toLocaleDateString()}</td><td><div className="table-actions"><Link to={`/admin/blog/${blog._id}`} aria-label="Edit"><Edit3 size={16}/></Link><button type="button" onClick={() => remove(blog._id)} aria-label="Delete"><Trash2 size={16}/></button></div></td></tr>)}{!blogs?.length && <tr><td colSpan="4" className="empty-admin">No blogs found.</td></tr>}</tbody></table></div>}
  </main></div>;
};
export default AllBlogs;
