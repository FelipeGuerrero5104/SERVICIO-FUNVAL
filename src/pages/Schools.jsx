// src/components/Services/Schools.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  obtenerSchools,
  crearSchool,
  actualizarSchool,
  eliminarSchool,
} from "../axios/schools";
import BotonHome from "../components/BotonHome";

export default function Schools() {
  const { user } = useAuth();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const { data } = await obtenerSchools();
      setSchools(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar escuelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleCreateClick = () => {
    setIsCreating(true);
    setFormData({ name: "", duration: "", image: null });
    setPreviewImage(null);
    setSelectedSchool(null);
  };

  const handleDetailClick = (school) => {
    setSelectedSchool(school);
    setIsCreating(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      name: selectedSchool.name,
      duration: selectedSchool.duration || "",
      image: null,
    });
    setPreviewImage(selectedSchool.imageUrl || null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("duration", formData.duration);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (isCreating) {
        await crearSchool(formDataToSend);
      } else {
        await actualizarSchool(selectedSchool.id, formDataToSend);
      }

      await loadSchools();
      setIsCreating(false);
      setIsEditing(false);
      setSelectedSchool(null);
      setPreviewImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar la solicitud");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar esta escuela?")) return;
    try {
      await eliminarSchool(selectedSchool.id);
      await loadSchools();
      setSelectedSchool(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la escuela");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando escuelas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="lg:h-screen p-6 w-full md:px-[10%] mx-auto dark:bg-slate-900">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-[#ffb400]">Escuelas</h1>
        {(user?.role?.name === "Admin" ||
          user?.role?.name === "Controller") && (
          <div className="flex gap-4">
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              Crear escuela
            </button>
            <BotonHome />
          </div>
        )}
      </div>

      {/* Formulario para crear/editar */}
      {(isCreating || isEditing) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-[#2b2b2b]">
          <h2 className="text-xl font-semibold mb-4 dark:text-[#1e88e5]">
            {isCreating ? "Crear Nueva Escuela" : "Editar Escuela"}
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 dark:text-gray-300"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-[#222222] dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 dark:text-gray-300 "
                htmlFor="duration"
              >
                Duración (meses)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-[#222222] dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 dark:text-gray-300"
                htmlFor="image"
              >
                Imagen
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded dark:bg-[#222222] dark:text-white"
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-20 object-cover rounded"
                  />
                </div>
              )}
              {selectedSchool?.imageUrl && !previewImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Imagen actual:</p>
                  <img
                    src={selectedSchool.imageUrl}
                    alt="Current"
                    className="h-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] text-white px-4 py-2 rounded "
              >
                {isCreating ? "Crear" : "Actualizar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setError("");
                  setPreviewImage(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vista de detalles */}
      {selectedSchool && !isEditing && (
        <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm dark:bg-[#2b2b2b]">
          <h2 className="text-xl font-semibold mb-2 dark:text-[#1e88e5]">
            Detalle de la Escuela
          </h2>
          {selectedSchool.imageUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={selectedSchool.imageUrl}
                alt={selectedSchool.name}
                className="h-40 object-cover rounded"
              />
            </div>
          )}
          <p className="dark:text-gray-400">
            <strong className="dark:text-white">ID:</strong> {selectedSchool.id}
          </p>
          <p className="dark:text-gray-400">
            <strong className="dark:text-white">Nombre:</strong>{" "}
            {selectedSchool.name}
          </p>
          {selectedSchool.duration && (
            <p className="dark:text-gray-400">
              <strong className="dark:text-white">Duración:</strong>{" "}
              {selectedSchool.duration} meses
            </p>
          )}

          {(user?.role?.name === "Admin" ||
            user?.role?.name === "Controller") && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEditClick}
                className="bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] text-white px-3 py-1 rounded "
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="bg-gradient-to-br from-red-400 to-red-600 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded "
              >
                Eliminar
              </button>
              <button
                onClick={() => setSelectedSchool(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lista de escuelas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {schools.map((school) => (
          <div
            key={school.id}
            className="flex flex-col border border-gray-300 shadow-sm py-4 px-4 rounded bg-white hover:shadow-md transition dark:bg-[#2b2b2b] dark:border-[#12345a]"
          >
            {school.imageUrl && (
              <div className="mb-4 flex justify-center ">
                <img
                  src={school.imageUrl}
                  alt={school.name}
                  className="h-40 w-full object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 text-center dark:text-white">
                {school.name}
              </h2>
              {school.duration && (
                <p className="text-gray-600 text-center dark:text-gray-300">
                  Duración: {school.duration} meses
                </p>
              )}
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => handleDetailClick(school)}
                  className="bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] text-white px-3 py-1 rounded "
                >
                  Detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
