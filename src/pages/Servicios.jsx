import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../Hooks/useData';
import instance from '../axios/axiosConfig';

const Servicios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateRoute = location.pathname === '/servicios/crear';
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useData('/categories');
  const { data: services, loading: servicesLoading, error: servicesError, refetch } = useData('/services');

  const [formData, setFormData] = useState({
    service_name: '',
    hours: '',
    category_id: '',
  });
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: 'Solo se permiten archivos PDF o Word (.doc, .docx).',
        }));
        setFile(null);
      } else if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: 'El archivo no debe exceder los 10MB.',
        }));
        setFile(null);
      } else {
        setFile(selectedFile);
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: '',
        }));
      }
    }
  };

  const handleImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validImages = selectedImages.filter((img) => {
      if (!allowedTypes.includes(img.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: 'Solo se permiten imágenes JPEG o PNG.',
        }));
        return false;
      }
      if (img.size > maxSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: 'Cada imagen no debe exceder los 10MB.',
        }));
        return false;
      }
      return true;
    });

    setImages(validImages);
    if (validImages.length === selectedImages.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: '',
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.service_name.trim()) {
      newErrors.service_name = 'El nombre del servicio es obligatorio.';
      isValid = false;
    }
    if (!formData.hours.trim()) {
      newErrors.hours = 'La cantidad de horas es obligatoria.';
      isValid = false;
    } else if (!/^\d+$/.test(formData.hours.trim()) || parseInt(formData.hours) <= 0) {
      newErrors.hours = 'Ingresa un número de horas válido (mayor a 0).';
      isValid = false;
    }
    if (!formData.category_id) {
      newErrors.category_id = 'Selecciona una categoría.';
      isValid = false;
    }
    if (!file) {
      newErrors.file = 'Debes subir un archivo PDF o Word.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage({ type: '', text: '' });
    setLoading(true);

    if (!validateForm()) {
      setSubmissionMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario.' });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('service_name', formData.service_name);
    formDataToSend.append('hours', parseInt(formData.hours));
    formDataToSend.append('category_id', parseInt(formData.category_id));
    formDataToSend.append('user_id', user.id);
    if (file) {
      formDataToSend.append('file', file);
    }
    images.forEach((image, index) => {
      formDataToSend.append(`images[${index}]`, image);
    });

    try {
      const { data, status } = await instance.post('/services', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (status === 200 || status === 201) {
        setSubmissionMessage({ type: 'success', text: '¡Servicio registrado exitosamente!' });
        setFormData({
          service_name: '',
          hours: '',
          category_id: '',
        });
        setFile(null);
        setImages([]);
        setErrors({});
        if (isCreateRoute) {
          navigate('/servicios'); // Redirigir a /servicios tras crear
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSubmissionMessage({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión nuevamente.' });
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'Error al registrar el servicio.';
        setSubmissionMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (serviceId) => {
    try {
      setLoading(true);
      await instance.patch(`/services/${serviceId}`, { status: 'approved' });
      setSubmissionMessage({ type: 'success', text: `Servicio ${serviceId} aprobado exitosamente.` });
      refetch(); // Recargar la lista de servicios
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'Error al aprobar el servicio.';
      setSubmissionMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (serviceId) => {
    try {
      setLoading(true);
      await instance.patch(`/services/${serviceId}`, { status: 'rejected' });
      setSubmissionMessage({ type: 'success', text: `Servicio ${serviceId} rechazado exitosamente.` });
      refetch(); // Recargar la lista de servicios
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'Error al rechazar el servicio.';
      setSubmissionMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (user?.role?.name !== 'Student' && user?.role?.name !== 'Admin') {
    return <Navigate to="/home" />;
  }

  if (servicesLoading && user?.role?.name === 'Admin') {
    return <p className="text-center mt-10">Cargando servicios...</p>;
  }
  if (servicesError && user?.role?.name === 'Admin') {
    return <p className="text-center mt-10 text-red-600">Error al cargar servicios: {servicesError.message}</p>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-100 font-poppins text-gray-800">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-full lg:max-w-4xl w-full my-5">
        <h1 className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-6 sm:mb-8">
          {user?.role?.name === 'Student' ? 'Registrar Servicio' : 'Gestionar Servicios'}
        </h1>

        {(user?.role?.name === 'Student' || isCreateRoute) && (
          <>
            {categoriesLoading ? (
              <p className="text-center">Cargando categorías...</p>
            ) : categoriesError ? (
              <p className="text-center text-red-600">Error al cargar categorías: {categoriesError.message}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-8 pb-5 border-b border-gray-200">
                  <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">
                    Información del Servicio
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className={`mb-2 md:mb-0 ${errors.service_name ? 'text-red-600' : ''}`}>
                      <label htmlFor="service_name" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
                        Nombre del Servicio <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="service_name"
                        name="service_name"
                        value={formData.service_name}
                        onChange={handleChange}
                        placeholder="Ej: Voluntariado en comedor comunitario"
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.service_name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                      />
                      {errors.service_name && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.service_name}</span>}
                    </div>
                    <div className={`mb-2 md:mb-0 ${errors.hours ? 'text-red-600' : ''}`}>
                      <label htmlFor="hours" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
                        Horas <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        placeholder="Ej: 10"
                        min="1"
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.hours ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                      />
                      {errors.hours && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.hours}</span>}
                    </div>
                    <div className={`mb-2 md:mb-0 ${errors.category_id ? 'text-red-600' : ''}`}>
                      <label htmlFor="category_id" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
                        Categoría <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.category_id}</span>}
                    </div>
                  </div>
                </div>
                <div className="mb-8 pb-5 border-b border-gray-200">
                  <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">
                    Documentación
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className={`mb-2 md:mb-0 ${errors.file ? 'text-red-600' : ''}`}>
                      <label htmlFor="file" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
                        Subir Archivo (PDF o Word) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.file ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                      />
                      {errors.file && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.file}</span>}
                      {file && <p className="text-gray-600 text-sm mt-1">Archivo seleccionado: {file.name}</p>}
                    </div>
                    <div className={`mb-2 md:mb-0 ${errors.images ? 'text-red-600' : ''}`}>
                      <label htmlFor="images" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
                        Subir Imágenes (Opcional)
                      </label>
                      <input
                        type="file"
                        id="images"
                        name="images"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleImagesChange}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                      />
                      {errors.images && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.images}</span>}
                      {images.length > 0 && (
                        <div className="text-gray-600 text-sm mt-1">
                          Imágenes seleccionadas: {images.map((img) => img.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registrando...' : 'Registrar Servicio'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {user?.role?.name === 'Admin' && !isCreateRoute && (
          <div>
            <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">
              Lista de Servicios
            </h2>
            {services.length === 0 ? (
              <p className="text-gray-600">No hay servicios registrados.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{service.service_name}</h3>
                    <p className="text-gray-600">Horas: {service.hours}</p>
                    <p className="text-gray-600">Categoría ID: {service.category_id}</p>
                    <p className="text-gray-600">Usuario ID: {service.user_id}</p>
                    <p className="text-gray-600">Estado: {service.status}</p>
                    {service.file_url && (
                      <a
                        href={service.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver archivo
                      </a>
                    )}
                    {service.images_urls && service.images_urls.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-600 text-sm">Imágenes:</p>
                        {service.images_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm block"
                          >
                            Imagen {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleApprove(service.id)}
                        disabled={loading || service.status === 'approved'}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(service.id)}
                        disabled={loading || service.status === 'rejected'}
                        className={`bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {submissionMessage.text && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center font-bold text-sm sm:text-base ${submissionMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
            {submissionMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicios;