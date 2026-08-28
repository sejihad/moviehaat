import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadUser, logout } from "./actions/userAction";
import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import ScrollToTop from "./component/layout/ScrollToTop";
import MetaData from "./component/layout/MetaData";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import AllMovies from "./pages/Admin/AllMovies";
import AllCategories from "./pages/Admin/AllCategories";
import AllUsers from "./pages/Admin/AllUsers";
import Dashboard from "./pages/Admin/Dashboard";
import MovieForm from "./pages/Admin/MovieForm";
import UserDetails from "./pages/Admin/UserDetails";
import AllBlogs from "./pages/Admin/AllBlogs";
import NewBlog from "./pages/Admin/NewBlog";
import UpdateBlog from "./pages/Admin/UpdateBlog";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";
import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import Home from "./pages/Home/Home";
import Blogs from "./pages/Blogs/Blogs";
import BlogDetails from "./pages/Blogs/BlogDetails";
import AboutUs from "./pages/About/AboutUs";
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy";
import MovieDetails from "./pages/Movies/MovieDetails";
import Movies from "./pages/Movies/Movies";
import WatchMovie from "./pages/Movies/WatchMovie";
import NotFound from "./pages/NotFound/NotFound";
import Delete from "./pages/User/Delete";
import Profile from "./pages/User/Profile";
import Setting from "./pages/User/Setting";
import UpdatePassword from "./pages/User/UpdatePassword";
import UpdateProfile from "./pages/User/UpdateProfile";

const Guard=({children,admin=false})=><ProtectedRoute isAdmin={admin}>{children}</ProtectedRoute>;
const GlobalMetaData=()=>{const {pathname}=useLocation();const pages={
  "/":{title:"Discover Movies & Cinema Stories",description:"Discover trending movies, latest releases, reviews and stories from the world of cinema on MovieHaat.",keywords:"movies, trending movies, latest releases, movie reviews, cinema, MovieHaat"},
  "/movies":{title:"Explore Movies",description:"Browse MovieHaat's collection of trending movies, latest releases, action, adventure and more.",keywords:"browse movies, trending movies, latest releases, action movies, MovieHaat"},
  "/blogs":{title:"Movie Journal",description:"Read movie reviews, watch guides, industry stories and thoughtful articles from the MovieHaat Journal.",keywords:"movie blog, movie reviews, watch guides, cinema news, MovieHaat Journal",type:"blog"},
  "/about":{title:"About Us",description:"Learn how MovieHaat publishes movie articles, reviews, recommendations and cinema news."},
  "/privacy":{title:"Privacy Policy",description:"Learn what personal information MovieHaat collects and how it is used and protected."},
  "/login":{title:"Login or Create an Account",description:"Sign in to MovieHaat or create an account to continue your movie journey.",noIndex:true},
  "/google-success":{title:"Completing Google Sign In",description:"Completing your secure MovieHaat sign in.",noIndex:true},
  "/password/forgot":{title:"Forgot Password",description:"Request a secure password reset link for your MovieHaat account.",noIndex:true},
  "/profile":{title:"My Profile",description:"View your MovieHaat account profile.",noIndex:true},
  "/profile/update":{title:"Update Profile",description:"Update your MovieHaat account information.",noIndex:true},
  "/profile/delete":{title:"Delete Account Request",description:"Manage your MovieHaat account deletion request.",noIndex:true},
  "/password/update":{title:"Change Password",description:"Securely change your MovieHaat account password.",noIndex:true},
  "/profile/setting":{title:"Account Settings",description:"Manage your MovieHaat account settings.",noIndex:true},
  "/admin/dashboard":{title:"Admin Dashboard",description:"MovieHaat administration dashboard.",noIndex:true},
  "/admin/movies":{title:"Manage Movies",description:"Manage the MovieHaat movie catalogue.",noIndex:true},
  "/admin/movie-categories":{title:"Manage Movie Categories",description:"Manage MovieHaat movie categories.",noIndex:true},
  "/admin/movie/new":{title:"Add Movie",description:"Add a movie to the MovieHaat catalogue.",noIndex:true},
  "/admin/blogs":{title:"Manage Blogs",description:"Manage MovieHaat Journal articles.",noIndex:true},
  "/admin/blog/new":{title:"Add Blog",description:"Create a MovieHaat Journal article.",noIndex:true},
  "/admin/users":{title:"Manage Users",description:"Manage MovieHaat user accounts.",noIndex:true},
};
const patterns=[
  [/^\/movies\/[^/]+$/,{title:"Movie Details",description:"View movie details, ratings, cast and more on MovieHaat."}],
  [/^\/watch\/[^/]+$/,{title:"Watch Movie",description:"Watch this movie on MovieHaat.",noIndex:true}],
  [/^\/blog\/[^/]+$/,{title:"Journal Article",description:"Read this story from the MovieHaat Journal.",type:"article"}],
  [/^\/password\/reset\/[^/]+$/,{title:"Reset Password",description:"Set a new password for your MovieHaat account.",noIndex:true}],
  [/^\/admin\/movie\/[^/]+$/,{title:"Edit Movie",description:"Edit a movie in the MovieHaat catalogue.",noIndex:true}],
  [/^\/admin\/blog\/[^/]+$/,{title:"Edit Blog",description:"Edit a MovieHaat Journal article.",noIndex:true}],
  [/^\/admin\/user\/[^/]+$/,{title:"User Details",description:"View and manage a MovieHaat user account.",noIndex:true}],
];
const metadata=pages[pathname]||patterns.find(([pattern])=>pattern.test(pathname))?.[1]||{title:"Page Not Found",description:"The requested MovieHaat page could not be found.",noIndex:true};return <MetaData {...metadata}/>;};
const App=()=>{const dispatch=useDispatch();useEffect(()=>{const token=localStorage.getItem("token");if(!token)return;try{jwtDecode(token).exp*1000>Date.now()?dispatch(loadUser()):dispatch(logout())}catch{dispatch(logout())}},[dispatch]);return <BrowserRouter><ScrollToTop/><GlobalMetaData/><Header/><Routes>
  <Route path="/" element={<Home/>}/><Route path="/movies" element={<Movies/>}/><Route path="/movies/:slug" element={<MovieDetails/>}/><Route path="/watch/:slug" element={<WatchMovie/>}/><Route path="/blogs" element={<Blogs/>}/><Route path="/blog/:slug" element={<BlogDetails/>}/><Route path="/about" element={<AboutUs/>}/><Route path="/privacy" element={<PrivacyPolicy/>}/><Route path="/login" element={<Login/>}/><Route path="/google-success" element={<GoogleSuccess/>}/><Route path="/password/forgot" element={<ForgotPassword/>}/><Route path="/password/reset/:token" element={<ResetPassword/>}/>
  <Route path="/profile" element={<Guard><Profile/></Guard>}/><Route path="/profile/update" element={<Guard><UpdateProfile/></Guard>}/><Route path="/profile/delete" element={<Guard><Delete/></Guard>}/><Route path="/password/update" element={<Guard><UpdatePassword/></Guard>}/><Route path="/profile/setting" element={<Guard><Setting/></Guard>}/>
  <Route path="/admin/dashboard" element={<Guard admin><Dashboard/></Guard>}/><Route path="/admin/movies" element={<Guard admin><AllMovies/></Guard>}/><Route path="/admin/movie-categories" element={<Guard admin><AllCategories/></Guard>}/><Route path="/admin/movie/new" element={<Guard admin><MovieForm/></Guard>}/><Route path="/admin/movie/:id" element={<Guard admin><MovieForm/></Guard>}/><Route path="/admin/blogs" element={<Guard admin><AllBlogs/></Guard>}/><Route path="/admin/blog/new" element={<Guard admin><NewBlog/></Guard>}/><Route path="/admin/blog/:id" element={<Guard admin><UpdateBlog/></Guard>}/><Route path="/admin/users" element={<Guard admin><AllUsers/></Guard>}/><Route path="/admin/user/:id" element={<Guard admin><UserDetails/></Guard>}/><Route path="*" element={<NotFound/>}/>
  </Routes><ToastContainer theme="dark"/><Footer/></BrowserRouter>};
export default App;
