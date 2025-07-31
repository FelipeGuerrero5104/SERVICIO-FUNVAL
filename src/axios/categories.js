// src/axios/categories.js
import axiosInstance from "./axiosConfig";

export const obtenerCategorias = () => axiosInstance.get("/categories");

export const crearCategoria = (data) =>
  axiosInstance.post("/categories", data);

export const actualizarCategoria = (id, data) =>
  axiosInstance.put(`/categories/${id}`, data);

export const eliminarCategoria = (id) =>
  axiosInstance.delete(`/categories/${id}`);
