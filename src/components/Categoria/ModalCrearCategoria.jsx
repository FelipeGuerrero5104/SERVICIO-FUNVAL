import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { crearCategoria } from "../../axios/categories";

export default function ModalCrearCategoria({ open, onClose, onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const { user } = useAuth();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCategoria({
        name: nombre,
        description: descripcion,
      });
      console.log("Categoría creada exitosamente");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error al crear la categoría:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-md dark:bg-[#2b2b2b]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 dark:text-[#1e88e5]">
          Crear Categoría
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium dark:text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded dark:bg-[#222222] dark:focus:outline-none dark:text-white "
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium dark:text-gray-300">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-[#222222] dark:text-white"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-600 "
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
