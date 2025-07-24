import axios from "axios";

const instance = axios.create({
  baseURL: "https://www.hs-service.api.crealape.com/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("token"); 
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;