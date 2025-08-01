import React from "react";
import { Link } from "react-router-dom";

export default function UsuariosCard({ id, full_name, email, phone, role }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-[#2b2b2b]">
      <h2 className="text-lg font-bold dark:text-white">{full_name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{phone}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Rol: {role}</p>
      
      <Link
        to={`/usuarios/${id}`}
        className="mt-2 inline-block bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] text-white px-4 py-1 rounded transition duration-300 ease-in-out"
      >
        Info
      </Link>
    </div>
  );
}
