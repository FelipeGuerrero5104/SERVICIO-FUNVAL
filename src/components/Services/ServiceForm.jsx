import { useState, useEffect } from "react";
import { crearServicio, actualizarServicio, obtenerCategorias } from "../../axios/services";

export default function ServiceForm({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    category_id: service?.category?.id || "",
    description: service?.description || "",
    amount_reported: service?.amount_reported || "",
    evidence: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data } = await obtenerCategorias();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.description || !formData.amount_reported) {
      alert("Por favor complete todos los campos");
      return;
    }

    if (!service && !formData.evidence) {
      alert("Por favor seleccione un archivo PDF como evidencia");
      return;
    }

    setLoading(true);
    try {
      if (service) {
        await actualizarServicio(service.id, {
          category_id: formData.category_id,
          description: formData.description,
          amount_reported: formData.amount_reported
        });
      } else {
        const data = new FormData();
        data.append('category_id', formData.category_id);
        data.append('description', formData.description);
        data.append('amount_reported', formData.amount_reported);
        data.append('evidence', formData.evidence);
        
        await crearServicio(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      alert("Error al guardar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">
          {service ? 'Editar Servicio' : 'Nuevo Servicio Social'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Categoría:</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Descripción:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded px-3 py-2"
              rows="4"
              required
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Horas realizadas:</label>
            <input
              type="number"
              min="1"
              value={formData.amount_reported}
              onChange={(e) => setFormData({...formData, amount_reported: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          {!service && (
            <div>
              <label className="block font-semibold mb-2">Evidencia (PDF):</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({...formData, evidence: e.target.files[0]})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2c7ee2] text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (service ? 'Actualizar' : 'Crear')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}