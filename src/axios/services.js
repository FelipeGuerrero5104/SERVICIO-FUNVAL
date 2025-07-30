import axiosInstance from "./axiosConfig";

export const obtenerServicios = () => axiosInstance.get("/services");

export const crearServicio = (formData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axiosInstance.post("/services", formData, config);
};

export const obtenerServicio = (id) => axiosInstance.get(`/services/${id}`);

export const actualizarServicio = (id, data) => axiosInstance.patch(`/services/${id}`, data);

export const revisarServicio = (id, data) => axiosInstance.patch(`/review/${id}`, data);

export const obtenerEvidencia = (id) => {
  return axiosInstance.get(`/evidence/${id}`, {
    responseType: 'blob'
  });
};

export const obtenerCategorias = () => axiosInstance.get("/categories");