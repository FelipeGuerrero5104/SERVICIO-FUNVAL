import { useEffect, useState } from "react";
import { obtenerServicios } from "../../axios/services";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import BotonHome from "../BotonHome";

export default function UserServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const { data } = await obtenerServicios();
      setServices(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceCreated = () => {
    setShowForm(false);
    setEditingService(null);
    cargarServicios();
  };

  const handleEdit = (service) => {
    if (service.status === "Pending") {
      setEditingService(service);
      setShowForm(true);
    }
  };

  if (loading)
    return (
      <div className="text-center py-4 dark:text-gray-300">
        Cargando servicios...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-5">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Mis Servicios Sociales
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-br from-[#2196f3] to-[#0d47a1] text-white px-4 py-2 rounded hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a]"
          >
            Nuevo Servicio
          </button>
          <BotonHome />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="relative">
            <ServiceCard service={service} isAdmin={false} />
            {service.status === "Pending" && (
              <button
                onClick={() => handleEdit(service)}
                className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Editar
              </button>
            )}
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tienes servicios registrados aún. ¡Crea tu primer servicio!
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSuccess={handleServiceCreated}
        />
      )}
    </div>
  );
}
