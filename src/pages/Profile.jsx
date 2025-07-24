import React, { useState, useEffect } from "react";
import { logout } from "../axios/auth";         
import { profile } from "../axios/profile";       
import { useNavigate } from "react-router-dom";


export default function Profile({ profileData: initialProfile }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(initialProfile);

  useEffect(() => {
    if (!initialProfile) {
      (async () => {
        try {
          const { data, status } = await profile();
          if (status === 200) setProfileData(data);
        } catch (err) {
          console.error("Error al obtener perfil en Profile.jsx:", err);
        }
      })();
    }
  }, [initialProfile]);

  const handleLogout = async () => {
    try {
      const { status } = await logout();
      if (status === 200) {
        navigate("/");
        console.log("Sesión cerrada exitosamente.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar la sesión.");
    }
  };

  if (!profileData) {
    return <p className="p-6 text-center text-lg text-gray-600">Cargando perfil…</p>;
  }

  const role = profileData.role?.name || "Usuario";
  const firstName = profileData.f_name || "Usuario";

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#023866] p-4 text-white flex flex-col md:flex-row items-center justify-between shadow-md">
        <button
          onClick={handleLogout}
          className="bg-[#2c7ee2] hover:bg-blue-400 text-white text-sm font-semibold py-2 px-5 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Cerrar Sesión
        </button>
        <div className="text-center md:text-left mt-2 md:mt-0">
          <h2 className="text-md md:text-lg font-semibold">
            Bienvenido, <span className="text-yellow-300">{firstName}</span>
            <span className="ml-2 text-sm font-normal text-gray-300">({role})</span>
          </h2>
        </div>
      </nav>
      <main className="p-6 flex flex-col md:flex-row gap-10 max-w-6xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/2">
          <h3 className="text-xl font-bold text-[#023866] mb-4">Información del Perfil</h3>
          <p><strong>Nombre:</strong> {profileData.f_name}</p>
          <p><strong>Correo:</strong> {profileData.email}</p>
          <p><strong>Rol:</strong> {role}</p>
        </div>
        <div className="w-full md:w-1/2">
        </div>
      </main>
    </div>
  );
}
