import { ArrowLeft, CalendarDays, Clock, Share2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getBlogDetails } from "../../actions/blogAction";
import MetaData from "../../component/layout/MetaData";
import "./blogs.css";

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const BlogDetails = () => {
  const dispatch = useDispatch(); const { slug } = useParams(); const { blog, loading, error } = useSelector((state) => state.blogDetails);
  useEffect(() => { dispatch(getBlogDetails(slug)); }, [dispatch, slug]);
  if (loading) return <main className="blog-api-state">Loading article...</main>;
  if (!blog?._id) return <main className="blog-api-state"><h1>Article not found</h1><p>{error}</p><Link to="/blogs">Back to journal</Link></main>;
  const plain = stripHtml(blog.desc); const seoDescription = blog.seoDescription || plain.slice(0, 160); const readTime = `${Math.max(1, Math.ceil(plain.split(" ").length / 200))} min read`;
  return <main className="article-page"><MetaData title={blog.seoTitle || blog.title} description={seoDescription} keywords={blog.seoKeywords} image={blog.image?.url} type="article"/><article><header className="article-hero container"><Link to="/blogs" className="article-back"><ArrowLeft size={17}/> Back to journal</Link><span className="article-tag">Journal</span><h1>{blog.title}</h1><p className="article-hero__excerpt">{seoDescription}</p><div className="article-byline"><div><strong>{blog.author?.name || "MovieHaat"}</strong><span>MovieHaat Editorial</span></div><span className="article-byline__divider"/><span><CalendarDays size={15}/>{new Date(blog.createdAt).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}</span><span><Clock size={15}/>{readTime}</span></div></header><div className="container article-cover"><img src={blog.image?.url} alt={blog.title}/></div><div className="container article-layout"><aside className="article-share"><span>Share</span><button type="button" aria-label="Share article" onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}><Share2 size={17}/></button></aside><div className="article-content rich-blog-content" dangerouslySetInnerHTML={{ __html: blog.desc || "" }}/></div></article></main>;
};
export default BlogDetails;
