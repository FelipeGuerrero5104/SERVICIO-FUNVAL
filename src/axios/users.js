// src/axios/users.js
import axiosInstance from "./axiosConfig";

export const obtenerUsuarios = () => axiosInstance.get("/users?r=1");
