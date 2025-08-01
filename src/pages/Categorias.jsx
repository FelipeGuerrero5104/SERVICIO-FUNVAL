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
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Cargando categorías...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-red-500 dark:text-red-400">
          Error al cargar categorías
        </p>
      </div>
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto dark:bg-slate-900">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-[#ffb400]">
            Categorías
          </h1>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {user?.role?.name === "Admin" && (
              <button
                className="bg-[#1e88e5] hover:bg-[#12345a] text-white px-4 py-2 rounded-lg shadow-md transition-colors w-full sm:w-auto text-center"
                onClick={() => setModalCrearAbierto(true)}
              >
                Agregar categoría
              </button>
            )}
            {user?.role?.name === "Admin" && <BotonHome />}
          </div>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-[#1e1e1e] dark:border-gray-700"
            >
              <div className="w-full h-40 sm:w-32 sm:h-auto sm:min-h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img
                  src={`/ImagenesCategorias/${categoria.id}.jpg`}
                  className="w-full h-full object-cover"
                  alt={`Imagen de ${categoria.name}`}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.className = "w-full h-full object-contain p-4";
                  }}
                />
              </div>

              <div className="flex-1 p-4 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {categoria.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                  {categoria.description || "Sin descripción"}
                </p>

                {user?.role?.name === "Admin" && (
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEditar(categoria)}
                      className="bg-[#1e88e5] hover:bg-[#12345a] text-white px-3 py-1 rounded text-sm transition-colors flex-1 text-center"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex-1 text-center"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modales */}
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
    </div>
  );
}
