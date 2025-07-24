import axios from "axios";

export const instance = axios.create({
  baseURL: `https://www.hs-service.api.crealape.com/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default instance;
