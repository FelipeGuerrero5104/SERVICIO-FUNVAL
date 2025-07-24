// src/pages/CategoryDetails.jsx
import { useParams } from "react-router-dom";
import useCategoriaById from "./hooks/useCategoriaById";


export default function CategoryDetails() {
  const { id } = useParams();
  const { categoria, loading } = useCategoriaById(id);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (!categoria) return <p className="text-center text-red-500">No encontrada</p>;

  return (
    <article className="max-w-2xl mx-auto p-6 bg-[#1E213A] text-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">{categoria.name}</h1>
      <p className="text-sm opacity-80 mb-6">{categoria.description}</p>
    </article>
  );
}
