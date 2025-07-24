// src/services/auth.js
import axios from "axios";

const API_URL = "https://www.hs-service.api.crealape.com/api/v1/auth";

export async function login() {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email: "admin@funval.test",
        password: "123456",
      },
      {
        withCredentials: true,
      }
    );

    console.log("Respuesta login:", response.data); // para ver qué contiene
    // Aquí ya no necesitas retornar un token si se usa por cookie
    return true; // simplemente indicamos que se logueó bien
  } catch (error) {
    console.error("Error en login:", error.response?.data || error);
    return false;
  }
}
