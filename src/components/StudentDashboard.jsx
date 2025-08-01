import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../Hooks/useData";
import {
  HiClock,
  HiAcademicCap,
  HiCheckCircle,
  HiLockClosed,
  HiUser,
} from "react-icons/hi";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: services,
    loading: servicesLoading,
    error: servicesError,
  } = useData(`/services?user_id=${user.id}`);

  const totalHours = servicesLoading
    ? 0
    : services
        .filter((service) => service.status === "Approved")
        .reduce(
          (sum, service) => sum + parseInt(service.amount_approved || 0),
          0
        );

  const latestServiceStatus = servicesLoading
    ? "Cargando..."
    : services.length > 0
    ? services.sort((a, b) => (b.id || 0) - (a.id || 0))[0].status ||
      "Sin servicios"
    : "Sin servicios";

  const school = user?.schools?.[0]?.name || "No especificado";

  const cards = [
    {
      title: "Horas de Servicio",
      value: servicesLoading ? "Cargando..." : `${totalHours} horas aprobadas`,
      icon: <HiClock className="h-8 w-8 text-white" />,
      onClick: () => navigate("/servicios"),
    },
    {
      title: "Escuela",
      value: school,
      icon: <HiAcademicCap className="h-8 w-8 text-white" />,
      onClick: () => navigate("/perfil"),
    },
    {
      title: "Estado de Servicio",
      value: latestServiceStatus,
      icon: <HiCheckCircle className="h-8 w-8 text-white" />,
      onClick: () => navigate("/servicios"),
    },
    {
      title: "Cambiar Contraseña",
      value: "Actualizar tu contraseña",
      icon: <HiLockClosed className="h-8 w-8 text-white" />,
      onClick: () => navigate("/change-password"),
    },
    {
      title: "Actualizar Datos",
      value: "Modificar tu información",
      icon: <HiUser className="h-8 w-8 text-white" />,
      onClick: () => navigate("/update-profile"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex justify-center items-start px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center dark:text-neutral-300">
          Bienvenido, {user?.f_name || "Estudiante"}
        </h1>
        {servicesError && (
          <p className="text-red-600 text-center mb-4">
            Error al cargar servicios: {servicesError.message}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white dark:bg-[#2b2b2b] shadow-xl rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:scale-103 "
            >
              <div className="bg-gradient-to-br from-[#0d47a1] to-[#12345a] h-16 flex items-center justify-center">
                {card.icon}
              </div>
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 dark:text-[#ffb400]">
                  {card.title}
                </h2>
                <p className="text-gray-600 dark:text-neutral-300">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
