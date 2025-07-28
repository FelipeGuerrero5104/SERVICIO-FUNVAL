import instance from "./axiosConfig";

export async function login(body) {
  try {
    const { data, status } = await instance.post("/auth/login", body);
    return { data, status };
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const { data, status } = await instance.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    return { data, status };
  } catch (error) {
    throw error;
  }
}

export async function register(body) {
  try {
    const { data, status } = await instance.post("/auth/register", body);
    return { data, status };
  } catch (error) {
    throw error;
  }
}

export async function cambioContraseña(body) {
  try {
    const { data, status } = await instance.put("/auth/change-password", body);
    return { data, status };
  } catch (error) {
    throw error;
  }
}