import React from "react";
import { Link } from "react-router";

export default function UsuariosCard({ id, full_name, email, phone, role }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold">{full_name}</h2>
      <p className="text-sm text-gray-600">{email}</p>
      <p className="text-sm text-gray-600">{phone}</p>
      <p className="text-sm text-gray-600">Rol: {role}</p>
      <Link
        to={`/usuarios/${id}`}
        className="mt-2 inline-block bg-blue-600 text-white px-4 py-1 rounded"
      >
        Info
      </Link>
    </div>
  );
}
