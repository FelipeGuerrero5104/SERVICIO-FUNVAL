// src/axios/schools.js
import axiosInstance from "./axiosConfig";

export const obtenerSchools = () => axiosInstance.get("/schools");
export const obtenerSchool = (id) => axiosInstance.get(`/schools/${id}`);
export const crearSchool = (formData) => {
  return axiosInstance.post("/schools", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const actualizarSchool = (id, formData) => {
  return axiosInstance.put(`/schools/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const eliminarSchool = (id) => axiosInstance.delete(`/schools/${id}`);
