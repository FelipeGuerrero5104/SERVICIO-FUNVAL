import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiClipboardList, HiUsers, HiTag, HiOfficeBuilding } from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Servicios',
      description: 'Gestionar servicios de los estudiantes',
      icon: <HiClipboardList className="h-8 w-8 text-white" />,
      onClick: () => navigate('/servicios'),
    },
    {
      title: 'Ver Usuarios',
      description: 'Ver y gestionar usuarios',
      icon: <HiUsers className="h-8 w-8 text-white" />,
      onClick: () => navigate('/usuarios'),
    },
    {
      title: 'Categorías',
      description: 'Gestionar categorías de servicios',
      icon: <HiTag className="h-8 w-8 text-white" />,
      onClick: () => navigate('/categorias'),
    },
    {
      title: 'Escuelas',
      description: 'Gestionar escuelas asignadas',
      icon: <HiOfficeBuilding className="h-8 w-8 text-white" />,
      onClick: () => navigate('/escuelas'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Bienvenido, {user?.f_name || 'Administrador'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white shadow-xl rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 h-16 flex items-center justify-center">
                {card.icon}
              </div>
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;