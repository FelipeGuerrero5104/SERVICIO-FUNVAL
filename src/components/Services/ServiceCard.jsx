import { obtenerEvidencia } from "../../axios/services";

export default function ServiceCard({ service, onReview, isAdmin }) {
  const handleDownloadEvidence = async () => {
    try {
      const response = await obtenerEvidencia(service.id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `evidencia_${service.id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar evidencia:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      Approved:
        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      Pending: "Pendiente",
      Approved: "Aprobado",
      Rejected: "Rechazado",
    };
    return texts[status] || status;
  };

  const formatDate = (service) => {
    const dateString = service.updated_at || service.created_at;
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isAdmin) {
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td className="py-3 px-4">{service.user?.full_name || "N/A"}</td>
        <td className="py-3 px-4">{service.category?.name || "N/A"}</td>
        <td className="py-3 px-4">{service.amount_reported}</td>
        <td className="py-3 px-4">
          <span
            className={`px-2 py-1 rounded-full text-sm ${getStatusBadge(
              service.status
            )}`}
          >
            {getStatusText(service.status)}
          </span>
        </td>
        <td className="py-3 px-4">{formatDate(service)}</td>
        <td className="py-3 px-4">
          <div className="flex gap-2">
            {service.status === "Pending" ? (
              <>
                <button
                  disabled
                  className="text-gray-400 text-sm cursor-not-allowed"
                >
                  Evidencia
                </button>
                <button
                  onClick={() => onReview(service)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Revisar
                </button>
              </>
            ) : (
              <button
                onClick={handleDownloadEvidence}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Evidencia
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow dark:bg-[#2b2b2b]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold dark:text-[#1e88e5]">
          {service.category?.name}
        </h3>
      </div>

      <p className="text-gray-600 mb-3 dark:text-neutral-300">
        {service.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-white">
            Horas reportadas
          </p>
          <p className="font-semibold dark:text-neutral-300">
            {service.amount_reported}h
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Estado</p>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
              service.status
            )}`}
          >
            {getStatusText(service.status)}
          </span>
        </div>
      </div>

      {service.comment && (
        <div className="mb-4 p-3 bg-gray-100 rounded dark:bg-[#2b2b2b]">
          <p className="text-sm text-gray-600 dark:text-white">
            Comentario de revisión:
          </p>
          <p className="text-sm dark:text-neutral-300">{service.comment}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-white">
          {formatDate(service)}
        </p>
        <button
          onClick={handleDownloadEvidence}
          className="text-[#2196f3] hover:text-[#1e88e5] text-sm cursor-pointer"
        >
          Descargar evidencia
        </button>
      </div>
    </div>
  );
}
