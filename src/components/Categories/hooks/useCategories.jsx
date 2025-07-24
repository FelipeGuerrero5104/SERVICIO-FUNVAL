// useCategorias.js
import { useEffect, useState } from "react";
import axios from "axios";
import { login } from "../Auth";

export default function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerCategorias = async () => {
    try {
      const ok = await login();

      if (!ok) {
        console.error("Fallo al iniciar sesión");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://www.hs-service.api.crealape.com/api/v1/categories",
        {
          withCredentials: true,
        }
      );

      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return { categorias, loading };
}
