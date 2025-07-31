import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../axios/axiosConfig';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
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
    if (!formData.current_password) newErrors.current_password = 'Ingresa tu contraseña actual.';
    if (!formData.new_password) newErrors.new_password = 'Ingresa una nueva contraseña.';
    if (formData.new_password.length < 6) newErrors.new_password = 'La nueva contraseña debe tener al menos 6 caracteres.';
    if (formData.new_password !== formData.confirm_password) newErrors.confirm_password = 'Las contraseñas no coinciden.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage({ type: '', text: '' });
    if (!validateForm()) return;

    setLoading(true);
    try {
      await instance.patch('/users/password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      setSubmissionMessage({ type: 'success', text: 'Contraseña actualizada exitosamente.' });
      setFormData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'Error al cambiar la contraseña.';
      setSubmissionMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cambiar Contraseña</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="current_password" className="block text-gray-700 font-semibold mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.current_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.current_password && <p className="text-red-600 text-sm mt-1">{errors.current_password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="new_password" className="block text-gray-700 font-semibold mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.new_password && <p className="text-red-600 text-sm mt-1">{errors.new_password}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="confirm_password" className="block text-gray-700 font-semibold mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.confirm_password && <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
          {submissionMessage.text && (
            <p className={`mt-4 text-center ${submissionMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {submissionMessage.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;