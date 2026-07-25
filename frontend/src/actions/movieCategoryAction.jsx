import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getAdminMovieCategories = async () => {
  const { data } = await axios.get(`${API_URL}/api/v1/admin/movie-categories`, auth());
  return data.categories;
};
export const createMovieCategory = async (payload) => {
  const { data } = await axios.post(`${API_URL}/api/v1/admin/movie-category/new`, payload, auth());
  return data.category;
};
export const updateMovieCategory = async (id, payload) => {
  const { data } = await axios.put(`${API_URL}/api/v1/admin/movie-category/${id}`, payload, auth());
  return data.category;
};
export const deleteMovieCategory = async (id) => axios.delete(`${API_URL}/api/v1/admin/movie-category/${id}`, auth());
