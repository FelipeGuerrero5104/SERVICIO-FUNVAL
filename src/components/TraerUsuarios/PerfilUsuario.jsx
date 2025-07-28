import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function PerfilUsuario() {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Mi Perfil</h2>
      <p><span className="font-semibold">Nombre completo:</span> {user.full_name}</p>
      <p><span className="font-semibold">Correo:</span> {user.email}</p>
      <p><span className="font-semibold">Teléfono:</span> {user.phone}</p>
      <p><span className="font-semibold">Rol:</span> {user.role?.name || "No asignado"}</p>
    </div>
  );
}