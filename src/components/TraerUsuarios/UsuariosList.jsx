import { useEffect, useState } from "react";
import instance from "../../axios/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UsuariosCard from "./UsuariosCard";
import BotonHome from "../BotonHome";

export default function ListaUsuarios() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]); 

  const [rolFiltro, setRolFiltro] = useState("todos");
  const [escuelaFiltro, setEscuelaFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const fetchCursos = async () => {
    try {
      const { data } = await instance.get("/schools");
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };
  const fetchUsuarios = async () => {
    try {
      const { data } = await instance.get("/users?r=1");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.role?.name?.toLowerCase() === "admin") {
      fetchUsuarios();
      fetchCursos();
    }
  }, [user]);

  if (user?.role?.name?.toLowerCase() !== "admin") return null;

  const usuariosFiltrados = usuarios.filter((u) => {
    const cumpleRol =
      rolFiltro === "todos" || u.role?.name?.toLowerCase() === rolFiltro;

    const cumpleBusqueda = u.full_name
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    return cumpleRol  && cumpleBusqueda;
  });

  // Obtener roles y escuelas únicas para los filtros
  const rolesUnicos = [
    ...new Set(
      usuarios.map((u) => u.role?.name?.toLowerCase()).filter(Boolean)
    ),
  ];
  const escuelasUnicas = cursos.map((curso) => curso.name?.toLowerCase());


  return (
    <div className="bg-white p-6 shadow-md dark:bg-slate-900">
      <div className="flex flex-col-reverse sm:flex-row sm justify-between items-center mb-4 mx-5">
        <h2 className="mt-5 text-3xl font-bold text-gray-800 dark:text-[#ffb400]">
          Lista de Usuarios
        </h2>
        <div className="flex gap-25 sm:gap-5">
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] text-white font-bold px-2 sm:py-2 sm:px-4 rounded-lg shadow transition duration-300 ease-in-out"
          >
            Crear Usuario
          </button>
          <BotonHome />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 px-5 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
        />

        <select
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
        >
          <option value="todos">Todos los Roles</option>
          {rolesUnicos.map((rol) => (
            <option key={rol} value={rol}>
              {rol.charAt(0).toUpperCase() + rol.slice(1)}
            </option>
          ))}
        </select>


      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mb-64">
          
          {usuariosFiltrados.map((u) => (
            <UsuariosCard
              key={u.id}
              id={u.id}
              name={u.role?.name}
              email={u.email}
              full_name={u.full_name}
              phone={u.phone}
              role={u.role?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
