import { useEffect, useState } from "react";
import axios from "axios";
import { login } from "../Auth";

export default function useCategoriaById(id) {
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoria = async () => {
    try {
      const ok = await login();
      if (!ok) return;

      const { data } = await axios.get(
        `https://www.hs-service.api.crealape.com/api/v1/categories/${id}`,
        { withCredentials: true }
      );
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener la categoría:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCategoria();
  }, [id]);

  return { categoria, loading };
}
