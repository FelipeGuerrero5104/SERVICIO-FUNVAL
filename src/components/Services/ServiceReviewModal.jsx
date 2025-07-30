import { useState } from "react";
import { revisarServicio, obtenerEvidencia } from "../../axios/services";

export default function ServiceReviewModal({ service, onClose, onComplete }) {
  const [approvedHours, setApprovedHours] = useState(service.amount_reported);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await revisarServicio(service.id, {
        status: "1",
        amount_approved: parseInt(approvedHours),
        comment: comment
      });
      onComplete();
    } catch (error) {
      console.error("Error al aprobar servicio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert("Por favor ingrese un comentario para rechazar el servicio");
      return;
    }
    
    setLoading(true);
    try {
      await revisarServicio(service.id, {
        status: "2",
        amount_approved: 0,
        comment: comment
      });
      onComplete();
    } catch (error) {
      console.error("Error al rechazar servicio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEvidence = async () => {
    try {
      const response = await obtenerEvidencia(service.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evidencia_${service.id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar evidencia:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Revisar Servicio</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="font-semibold">Estudiante:</p>
            <p>{service.user?.full_name}</p>
          </div>
          
          <div>
            <p className="font-semibold">Categoría:</p>
            <p>{service.category?.name}</p>
          </div>
          
          <div>
            <p className="font-semibold">Descripción:</p>
            <p>{service.description}</p>
          </div>
          
          <div>
            <p className="font-semibold">Horas reportadas:</p>
            <p>{service.amount_reported}h</p>
          </div>
          
          <button
            onClick={handleDownloadEvidence}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Descargar Evidencia PDF
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Horas a aprobar:</label>
            <input
              type="number"
              min="0"
              max={service.amount_reported}
              value={approvedHours}
              onChange={(e) => setApprovedHours(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Comentario (opcional para aprobar, requerido para rechazar):</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Aprobar
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Rechazar
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}