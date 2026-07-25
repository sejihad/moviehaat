import { Edit3, FolderOpen, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createMovieCategory, deleteMovieCategory, getAdminMovieCategories, updateMovieCategory } from "../../actions/movieCategoryAction";
import MetaData from "../../component/layout/MetaData";
import Sidebar from "./Sidebar";
import "./adminMovies.css";

const emptyForm = { name: "", description: "", active: true };
const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setCategories(await getAdminMovieCategories()); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load categories"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const reset = () => { setForm(emptyForm); setEditId(null); setOpen(false); };
  const edit = (category) => { setForm({ name: category.name, description: category.description || "", active: category.active }); setEditId(category._id); setOpen(true); };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      if (editId) await updateMovieCategory(editId, form); else await createMovieCategory(form);
      toast.success(editId ? "Category updated" : "Category created"); reset(); await load();
    } catch (error) { toast.error(error.response?.data?.message || "Could not save category"); }
    finally { setSaving(false); }
  };
  const remove = async (category) => {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    try { await deleteMovieCategory(category._id); toast.success("Category deleted"); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Could not delete category"); }
  };

  return <div className="admin-shell"><Sidebar /><main className="admin-content"><MetaData title="Movie Categories | Admin" />
    <div className="admin-title"><div><p>Movie library</p><h1>Movie categories</h1></div><button className="admin-primary" onClick={() => { if (open) reset(); else setOpen(true); }}>{open ? <X size={18} /> : <Plus size={18} />}{open ? "Close" : "Add category"}</button></div>
    {open && <form className="category-admin-form" onSubmit={submit}><div><h2>{editId ? "Edit category" : "New category"}</h2><p>Movies will select one of these categories.</p></div><label>Category name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required placeholder="e.g. Web Series" /></label><label className="wide">Description<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Optional category description" /></label><label className="switch-row wide"><span>Active and available for selection</span><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /></label><div className="category-form-actions"><button type="submit" className="admin-primary" disabled={saving}>{saving ? "Saving..." : editId ? "Update category" : "Create category"}</button>{editId && <button type="button" className="admin-secondary" onClick={reset}>Cancel</button>}</div></form>}
    {loading ? <div className="admin-loading">Loading categories...</div> : <div className="category-grid">{categories.map((category) => <article className="category-card" key={category._id}><div className="category-icon"><FolderOpen /></div><div><h3>{category.name}</h3><p>{category.description || "No description"}</p><span className={`status ${category.active ? "live" : "draft"}`}>{category.active ? "Active" : "Inactive"}</span></div><div className="table-actions"><button title="Edit" onClick={() => edit(category)}><Edit3 size={17} /></button><button title="Delete" onClick={() => remove(category)}><Trash2 size={17} /></button></div></article>)}{categories.length === 0 && <div className="empty-state"><FolderOpen size={34} /><h3>No movie categories</h3><p>Create a category before adding movies.</p></div>}</div>}
  </main></div>;
};
export default AllCategories;
