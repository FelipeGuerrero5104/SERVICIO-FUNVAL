// src/pages/Categorias.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../Hooks/useData";
import ModalCrearCategoria from "../components/Categoria/ModalCrearCategoria";
import ModalEditarCategoria from "../components/Categoria/ModalEditarCategoria";
import { eliminarCategoria } from "../axios/categories";
import BotonHome from "../components/BotonHome";

export default function Categorias() {
  const { data: categorias, loading, error, refetch } = useData("/categories");
  const { user } = useAuth();
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  if (loading)
    return <p className="text-center mt-10">Cargando categorías...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error al cargar categorías</p>
    );

  const handleEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalEditarOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await eliminarCategoria(id);
      refetch();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    }
  };

  return (
    <div className="lg:h-screen p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <div className="flex gap-2">
          {user?.role?.name === "Admin" && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={() => setModalCrearAbierto(true)}
            >
              Agregar categoría
            </button>
          )}
          {user?.role?.name === "Admin" && <BotonHome />}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="flex border border-gray-300 shadow-sm py-4 px-1 rounded bg-white hover:shadow-md transition"
          >
            <img
              src={`/ImagenesCategorias/${categoria.id}.jpg`}
              className="h-30 w-30 mx-3 "
              alt={`Imagen de ${categoria.id}`}
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{categoria.name}</h2>
              <p className="text-gray-600">
                {categoria.description || "Sin descripción"}
              </p>
              <div className="flex gap-3">
                {user?.role?.name === "Admin" && (
                  <button
                    onClick={() => handleEditar(categoria)}
                    className="bg-blue-600 text-white px-2 py-1 rounded mt-2 cursor-pointer hover:bg-blue-700 "
                  >
                    {" "}
                    Editar{" "}
                  </button>
                )}
                {user?.role?.name === "Admin" && (
                  <button
                    onClick={() => handleDelete(categoria.id)}
                    className="bg-red-800 text-white px-2 py-1 rounded mt-2 cursor-pointer hover:bg-red-900 "
                  >
                    {" "}
                    Eliminar{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalCrearCategoria
        open={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onSuccess={refetch}
      />
      <ModalEditarCategoria
        open={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
        categoria={categoriaSeleccionada}
        onSuccess={refetch}
      />
    </div>
  );
}
