import { useEffect, useState } from "react";
import { obtenerServicios, obtenerCategorias } from "../../axios/services";
import ServiceCard from "./ServiceCard";
import ServiceReviewModal from "./ServiceReviewModal";
import BotonHome from "../BotonHome";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    student: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        obtenerServicios(),
        obtenerCategorias(),
      ]);
      setServices(servicesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (service) => {
    setSelectedService(service);
    setShowReviewModal(true);
  };

  const handleReviewComplete = () => {
    setShowReviewModal(false);
    setSelectedService(null);
    cargarDatos();
  };

  const filteredServices = services.filter((service) => {
    // Status mapping: Approved = "1", Rejected = "2", Pending = null/"Pending"
    if (filters.status) {
      if (filters.status === "pending" && service.status !== "Pending")
        return false;
      if (filters.status === "approved" && service.status !== "Approved")
        return false;
      if (filters.status === "rejected" && service.status !== "Rejected")
        return false;
    }
    if (filters.category && service.category?.id !== parseInt(filters.category))
      return false;
    if (
      filters.student &&
      !service.user?.full_name
        ?.toLowerCase()
        .includes(filters.student.toLowerCase())
    )
      return false;

    const serviceDate = service.updated_at || service.created_at;
    if (filters.dateFrom && new Date(serviceDate) < new Date(filters.dateFrom))
      return false;
    if (filters.dateTo && new Date(serviceDate) > new Date(filters.dateTo))
      return false;
    return true;
  });

  if (loading)
    return (
      <div className="text-center py-4 dark:text-gray-300">
        Cargando servicios...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="md:flex justify-between">
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-[#ffb400]">
          Gestión de Servicios
        </h1>
        <div className="hidden md:block">
          <BotonHome />
        </div>
      </div>

      <div className="flex justify-center md:hidden">
        <BotonHome />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md dark:bg-[#2b2b2b]">
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-3 py-2 dark:text-white dark:focus:bg-[#1e1e1f] "
          >
            <option className="dark:bg-[#12345a]" value="">
              Todos los estados
            </option>
            <option className="dark:bg-[#12345a]" value="pending">
              Pendiente
            </option>
            <option className="dark:bg-[#12345a]" value="approved">
              Aprobado
            </option>
            <option className="dark:bg-[#12345a]" value="rejected">
              Rechazado
            </option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="border rounded px-3 py-2 dark:text-white dark:focus:bg-[#1e1e1f]"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={filters.student}
            onChange={(e) =>
              setFilters({ ...filters, student: e.target.value })
            }
            className="border rounded px-3 py-2 dark:text-white dark:focus:bg-[#1e1e1f]"
          />

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
            className="border rounded px-3 py-2 dark:text-white dark:focus:bg-[#1e1e1f]"
          />

          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="border rounded px-3 py-2 dark:text-white dark:focus:bg-[#1e1e1f]"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl">
        <table className="min-w-full bg-white rounded-2xl shadow-md dark:bg-[#2b2b2b]">
          <thead className="bg-gradient-to-br from-[#0d47a1] to-[#12345a] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Estudiante</th>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Horas Reportadas</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onReview={handleReview}
                isAdmin={true}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showReviewModal && (
        <ServiceReviewModal
          service={selectedService}
          onClose={() => setShowReviewModal(false)}
          onComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}
