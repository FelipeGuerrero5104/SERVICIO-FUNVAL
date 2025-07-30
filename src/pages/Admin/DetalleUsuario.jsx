import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import instance from "../../axios/axiosConfig";

export default function DetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [usuario, setUsuario] = useState(null);
  const [cursoId, setCursoId] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const { data } = await instance.get(`/users/${id}`);
        setUsuario(data);
        setCursoId(data.schools?.id || null);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCursos = async () => {
      try {
        const { data } = await instance.get("/schools");
        setCursos(data);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      }
    };

    fetchUsuario();
    fetchCursos();
  }, [id]);

/*   const actualizarCurso = async () => {
    try {
      await instance.put(`/users/${id}`, {
        school_ids: [cursoId],
      });
      alert("Curso actualizado");
    } catch (error) {
      console.error("Error al actualizar curso:", error);
    }
  }; */

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!usuario) return <p>No se encontró el usuario</p>;

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col bg-white shadow-md rounded mt-10 mb-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-2 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-800 cursor-pointer"
      >
        Volver atrás
      </button>

      <h2 className="text-2xl font-bold mb-2">{usuario.full_name}</h2>

      <div className="space-y-1 text-gray-700">
        <p>
          <strong>ID:</strong> {usuario.id}
        </p>
        <p>
          <strong>Nombre:</strong> {usuario.f_name} {usuario.m_name}
        </p>
        <p>
          <strong>Apellido:</strong> {usuario.f_lastname} {usuario.s_lastname}
        </p>
        <p>
          <strong>Email:</strong> {usuario.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {usuario.phone}
        </p>
        <p>
          <strong>Estado:</strong> {usuario.status}
        </p>
        <p>
          <strong>Rol:</strong> {usuario.role?.name}
        </p>
        <p className="mb-1">
          <strong>Curso actual:</strong>{" "}
          {usuario.schools && usuario.schools.length > 0
            ? usuario.schools.map((curso) => curso.name).join(", ")
            : "No asignado"}
        </p>
      </div>

      {user?.role?.name === "Admin" && (
        <div className="mt-6">
          <label className="block mb-2 font-semibold">Actualizar Curso:</label>
          <select
            value={cursoId || ""}
            onChange={(e) => setCursoId(Number(e.target.value))}
            className="border px-3 py-2 w-full mb-3 rounded"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.name}
              </option>
            ))} 
          </select>
          <button
            
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={!cursoId}
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}