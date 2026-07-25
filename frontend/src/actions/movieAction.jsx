import axios from "axios";
import * as types from "../constants/movieConstants";

const API_URL = import.meta.env.VITE_API_URL || "";
const message = (error) => error.response?.data?.message || error.message;
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getMovies = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.MOVIES_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v1/movies`, { params });
    dispatch({ type: types.MOVIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: types.MOVIES_FAIL, payload: message(error) });
  }
};

export const getMovie = (slug) => async (dispatch) => {
  try {
    dispatch({ type: types.MOVIE_DETAILS_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v1/movie/${slug}`);
    dispatch({ type: types.MOVIE_DETAILS_SUCCESS, payload: data.movie });
  } catch (error) {
    dispatch({ type: types.MOVIE_DETAILS_FAIL, payload: message(error) });
  }
};

export const getAdminMovies = () => async (dispatch) => {
  try {
    dispatch({ type: types.ADMIN_MOVIES_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v1/admin/movies`, auth());
    dispatch({ type: types.ADMIN_MOVIES_SUCCESS, payload: data.movies });
  } catch (error) {
    dispatch({ type: types.ADMIN_MOVIES_FAIL, payload: message(error) });
  }
};

export const getAdminMovie = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/v1/admin/movie/${id}`, auth());
  return data.movie;
};

const mutate = (request) => async (dispatch) => {
  try {
    dispatch({ type: types.MOVIE_MUTATION_REQUEST });
    const { data } = await request();
    dispatch({ type: types.MOVIE_MUTATION_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: types.MOVIE_MUTATION_FAIL, payload: message(error) });
    throw error;
  }
};

export const createMovie = (form) => mutate(() => axios.post(`${API_URL}/api/v1/admin/movie/new`, form, auth()));
export const updateMovie = (id, form) => mutate(() => axios.put(`${API_URL}/api/v1/admin/movie/${id}`, form, auth()));
export const deleteMovie = (id) => mutate(() => axios.delete(`${API_URL}/api/v1/admin/movie/${id}`, auth()));
export const resetMovieMutation = () => ({ type: types.MOVIE_MUTATION_RESET });
