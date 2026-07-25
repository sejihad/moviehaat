import * as types from "../constants/movieConstants";

export const moviesReducer = (state = { movies: [], total: 0, pages: 0 }, action) => {
  switch (action.type) {
    case types.MOVIES_REQUEST: return { ...state, loading: true, error: null };
    case types.MOVIES_SUCCESS: return { loading: false, ...action.payload };
    case types.MOVIES_FAIL: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};
export const movieDetailsReducer = (state = { movie: null }, action) => {
  switch (action.type) {
    case types.MOVIE_DETAILS_REQUEST: return { ...state, loading: true, error: null };
    case types.MOVIE_DETAILS_SUCCESS: return { loading: false, movie: action.payload };
    case types.MOVIE_DETAILS_FAIL: return { loading: false, movie: null, error: action.payload };
    default: return state;
  }
};
export const adminMoviesReducer = (state = { movies: [] }, action) => {
  switch (action.type) {
    case types.ADMIN_MOVIES_REQUEST: return { ...state, loading: true, error: null };
    case types.ADMIN_MOVIES_SUCCESS: return { loading: false, movies: action.payload };
    case types.ADMIN_MOVIES_FAIL: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};
export const movieMutationReducer = (state = {}, action) => {
  switch (action.type) {
    case types.MOVIE_MUTATION_REQUEST: return { loading: true };
    case types.MOVIE_MUTATION_SUCCESS: return { loading: false, success: true, result: action.payload };
    case types.MOVIE_MUTATION_FAIL: return { loading: false, error: action.payload };
    case types.MOVIE_MUTATION_RESET: return {};
    default: return state;
  }
};
