import { useEffect, useState } from "react";
import instance from "../../axios/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Añadimos useNavigate
import UsuariosCard from "./UsuariosCard";
import BotonHome from "../BotonHome";

export default function ListaUsuarios() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook para redirigir
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (user?.role?.name?.toLowerCase() === "admin") {
      fetchUsuarios();
    }
  }, [user]);

  if (user?.role?.name?.toLowerCase() !== "admin") return null;

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4 mx-5">
        <h2 className="text-xl font-bold text-gray-800">Lista de Usuarios</h2>
        <div className="flex gap-5">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 ease-in-out"
          >
            Crear Usuario
          </button>
          <BotonHome />
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {usuarios.map((u) => (
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
