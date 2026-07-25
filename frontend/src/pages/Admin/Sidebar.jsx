import { BookOpen, Film, FolderOpen, LayoutDashboard, Menu, Plus, Users, X } from "lucide-react";
import { createElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./adminMovies.css";
import "./adminMovieEnhancements.css";
import "./adminLayout.css";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }, { to: "/admin/movies", label: "Movies", icon: Film },
  { to: "/admin/movie-categories", label: "Movie categories", icon: FolderOpen }, { to: "/admin/movie/new", label: "Add movie", icon: Plus },
  { to: "/admin/blogs", label: "Blogs", icon: BookOpen }, { to: "/admin/blog/new", label: "Add blog", icon: Plus }, { to: "/admin/users", label: "Users", icon: Users },
];

const Sidebar = () => {
  const { pathname } = useLocation(); const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  return <><button type="button" className="admin-menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle admin menu">{open ? <X/> : <Menu/>}<span>Admin menu</span></button>{open && <button className="admin-menu-backdrop" type="button" aria-label="Close admin menu" onClick={() => setOpen(false)}/>}<aside className={`admin-sidebar ${open ? "is-open" : ""}`}><Link className="admin-brand" to="/"><Film/><span>Movie<b>Hut</b></span></Link><nav>{links.map((item) => <Link key={item.to} className={pathname === item.to || (!item.to.endsWith("new") && item.to !== "/admin/dashboard" && pathname.startsWith(item.to)) ? "active" : ""} to={item.to}>{createElement(item.icon, { size: 19 })}{item.label}</Link>)}</nav></aside></>;
};
export default Sidebar;
