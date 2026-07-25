import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { adminMoviesReducer, movieDetailsReducer, movieMutationReducer, moviesReducer } from "./reducers/movieReducer";
import { blogAdminDetailsReducer, blogDetailsReducer, blogReducer, blogsReducer, newBlogReducer } from "./reducers/blogReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userEmailRequestReducer, userReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userEmail: userEmailRequestReducer,
  forgotPassword: forgotPasswordReducer,
  userDetails: userDetailsReducer,
  allUsers: allUsersReducer,
  movies: moviesReducer,
  movieDetails: movieDetailsReducer,
  adminMovies: adminMoviesReducer,
  movieMutation: movieMutationReducer,
  blogs: blogsReducer,
  newBlog: newBlogReducer,
  blog: blogReducer,
  blogDetails: blogDetailsReducer,
  blogAdminDetails: blogAdminDetailsReducer,
});
const persistedReducer = persistReducer({ key: "root", storage, whitelist: ["user"] }, rootReducer);
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
export default store;
