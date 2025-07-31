import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import instance from '../axios/axiosConfig';

const UpdateProfile = () => {
  const { user, loadUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    f_name: user?.f_name || '',
    m_name: user?.m_name || '',
    f_lastname: user?.f_lastname || '',
    s_lastname: user?.s_lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.f_name.trim()) newErrors.f_name = 'El nombre es obligatorio.';
    if (!formData.f_lastname.trim()) newErrors.f_lastname = 'El apellido paterno es obligatorio.';
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo no es válido.';
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'El teléfono debe tener 10 dígitos.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage({ type: '', text: '' });
    if (!validateForm()) {
      setSubmissionMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario.' });
      return;
    }

    setLoading(true);
    try {
      const response = await instance.put(`/users/${user.id}`, {
        f_name: formData.f_name,
        m_name: formData.m_name || null,
        f_lastname: formData.f_lastname,
        s_lastname: formData.s_lastname || null,
        email: formData.email,
        phone: formData.phone || null,
      });
      console.log('Respuesta de UpdateProfile:', { status: response.status, data: response.data }); // Depuración
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setSubmissionMessage({ type: 'success', text: 'Datos actualizados exitosamente.' });
        await loadUserProfile(); // Recargar el perfil usando GET /auth/profile
        setTimeout(() => navigate('/perfil'), 2000);
      } else {
        setSubmissionMessage({ type: 'error', text: `Respuesta inesperada del servidor: ${response.status}` });
      }
    } catch (error) {
      console.error('Error en UpdateProfile:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      }); // Depuración
      const status = error.response?.status;
      let errorMessage = 'Error al actualizar los datos.';
      if (status === 400 || status === 422) {
        errorMessage = error.response?.data?.message || error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Datos inválidos. Por favor, revisa los campos.';
      } else if (status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else {
        errorMessage = `Error del servidor: ${status || error.message}`;
      }
      setSubmissionMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Actualizar Datos</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="f_name" className="block text-gray-700 font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="f_name"
              name="f_name"
              value={formData.f_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.f_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.f_name && <p className="text-red-600 text-sm mt-1">{errors.f_name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="m_name" className="block text-gray-700 font-semibold mb-2">
              Segundo Nombre (Opcional)
            </label>
            <input
              type="text"
              id="m_name"
              name="m_name"
              value={formData.m_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="f_lastname" className="block text-gray-700 font-semibold mb-2">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="f_lastname"
              name="f_lastname"
              value={formData.f_lastname}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.f_lastname ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.f_lastname && <p className="text-red-600 text-sm mt-1">{errors.f_lastname}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="s_lastname" className="block text-gray-700 font-semibold mb-2">
              Apellido Materno (Opcional)
            </label>
            <input
              type="text"
              id="s_lastname"
              name="s_lastname"
              value={formData.s_lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
              Teléfono (Opcional)
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
          {submissionMessage.text && (
            <p className={`mt-4 text-center text-sm font-medium ${submissionMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {submissionMessage.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;