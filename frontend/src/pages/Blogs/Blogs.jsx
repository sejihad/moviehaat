import { ArrowRight, Clock } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBlog } from "../../actions/blogAction";
import "./blogs.css";

const text = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const view = (blog) => ({ ...blog, excerpt: blog.seoDescription || text(blog.desc).slice(0, 180), date: new Date(blog.createdAt).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" }), readTime: `${Math.max(1, Math.ceil(text(blog.desc).split(" ").length / 200))} min read` });

const Blogs = () => {
  const dispatch = useDispatch();
  const { blogs, loading, loadingMore, error, page = 1, pages = 1, total = 0 } = useSelector((state) => state.blogs);
  useEffect(() => { dispatch(getBlog(1)); }, [dispatch]);
  const list = (blogs || []).map(view);
  const [featured, ...articles] = list;
  if (loading) return <main className="blog-api-state">Loading articles...</main>;
  if (!featured) return <main className="blog-api-state"><h1>No articles yet</h1><p>{error || "New admin blogs will appear here."}</p></main>;
  return <main className="blogs-page"><section className="blogs-intro container"><p className="blogs-kicker">MovieHaat Journal</p><h1>Stories beyond the screen.</h1><p className="blogs-intro__copy">Reviews, watch guides, industry stories and the moments that make cinema unforgettable.</p></section>
    <section className="container featured-article"><Link to={`/blog/${featured.slug}`} className="featured-article__image"><img src={featured.image?.url} alt={featured.title}/></Link><div className="featured-article__content"><span className="article-tag">Featured</span><h2><Link to={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><div className="article-meta"><span>{featured.date}</span><span>•</span><span><Clock size={14}/>{featured.readTime}</span></div><Link to={`/blog/${featured.slug}`} className="article-link">Read article <ArrowRight size={16}/></Link></div></section>
    <section className="container blog-library"><header className="blog-library__heading"><div><p>Latest stories</p><h2>From the Journal</h2></div><span>{list.length} of {total || list.length} articles</span></header><div className="blog-grid">{articles.map((article) => <article className="blog-card" key={article._id}><Link to={`/blog/${article.slug}`} className="blog-card__image"><img src={article.image?.url} alt={article.title} loading="lazy"/><span>Journal</span></Link><div className="blog-card__body"><div className="article-meta"><span>{article.date}</span><span>•</span><span>{article.readTime}</span></div><h3><Link to={`/blog/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><Link to={`/blog/${article.slug}`} className="article-link">Read more <ArrowRight size={15}/></Link></div></article>)}</div>{page < pages && <div className="blog-load-more"><button type="button" onClick={() => dispatch(getBlog(page + 1, true))} disabled={loadingMore}>{loadingMore ? "Loading..." : "Load more articles"}</button></div>}</section>
  </main>;
};

export default Blogs;
