// src/components/ListaUsuarios.jsx
import { useEffect, useState } from "react";
import instance from "../../axios/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import UsuariosCard from "./UsuariosCard";

export default function ListaUsuarios() {
  const { user } = useAuth();
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
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Lista de Usuarios
      </h2>
      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {usuarios.map((u) => (
            <UsuariosCard
            key={u.id}
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
