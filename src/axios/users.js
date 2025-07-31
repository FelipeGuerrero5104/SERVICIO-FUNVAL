// src/axios/users.js
import axiosInstance from "./axiosConfig";

export const obtenerUsuarios = () => axiosInstance.get("/users?r=1");
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const updateUser = (id, body) => axiosInstance.put(`/users/${id}`, body);