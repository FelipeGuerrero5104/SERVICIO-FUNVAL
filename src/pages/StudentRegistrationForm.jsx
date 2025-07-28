import React, { useState } from 'react';

const API_BASE_URL = 'https://www.hs-service.api.crealape.com/api/v1';

const StudentRegistrationForm = ({ onLogout, currentUserId }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    f_name: '',
    m_name: '',
    f_lastname: '',
    s_lastname: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    school_id: '',
    status: 'active',
    role_id: 4,
    country_id: '',
    controller_id: currentUserId || null,
    recruiter_id: currentUserId || null,
  });

  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.student_id.trim()) {
      newErrors.student_id = 'El ID del estudiante es obligatorio.';
      isValid = false;
    } else if (!/^[0-9]+$/.test(formData.student_id.trim())) {
      newErrors.student_id = 'El ID del estudiante debe ser numérico.';
      isValid = false;
    }
    if (!formData.f_name.trim()) {
      newErrors.f_name = 'El primer nombre es obligatorio.';
      isValid = false;
    }
    if (!formData.f_lastname.trim()) {
      newErrors.f_lastname = 'El primer apellido es obligatorio.';
      isValid = false;
    }
    if (!formData.dob.trim()) {
      newErrors.dob = 'La fecha de nacimiento es obligatoria.';
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
      isValid = false;
    }
    const phoneRegex = /^[0-9\s\-+()]{7,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Ingresa un número de teléfono válido.';
      isValid = false;
    }
    if (!formData.school_id) {
      newErrors.school_id = 'Selecciona una escuela.';
      isValid = false;
    }
    if (!formData.country_id) {
      newErrors.country_id = 'Selecciona un país.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage({ type: '', text: '' });

    if (validateForm()) {
      const finalStudentData = {
        id: parseInt(formData.student_id),
        f_name: formData.f_name,
        m_name: formData.m_name || null,
        f_lastname: formData.f_lastname,
        s_lastname: formData.s_lastname || null,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        status: formData.status,
        role_id: formData.role_id,
        schools: [parseInt(formData.school_id)],
        dob: formData.dob,
        controller_id: formData.controller_id,
        recruiter_id: formData.recruiter_id,
        country_id: parseInt(formData.country_id),
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(finalStudentData),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setSubmissionMessage({ type: 'success', text: '¡Estudiante registrado exitosamente!' });
          } else {
            setSubmissionMessage({ type: 'success', text: '¡Estudiante registrado exitosamente! (Sin contenido de respuesta JSON)' });
          }
          setFormData({
            student_id: '', f_name: '', m_name: '', f_lastname: '', s_lastname: '', dob: '',
            email: '', phone: '', password: '', school_id: '', country_id: '', status: 'active', role_id: 4,
            controller_id: currentUserId || null,
            recruiter_id: currentUserId || null,
          });
          setErrors({});
        } else {
          let errorMessage = `Error en el registro: ${response.status} - ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = `Error en el registro: ${response.status} - ${errorData.message || errorData.detail || JSON.stringify(errorData)}`;
          } catch {
            console.error('La respuesta de error no es JSON o está vacía:', await response.text());
          }
          setSubmissionMessage({ type: 'error', text: errorMessage });
          if (response.status === 401) {
            onLogout();
          }
        }
      } catch (error) {
        setSubmissionMessage({ type: 'error', text: `Error de red o del servidor: ${error.message}` });
      }
    } else {
      setSubmissionMessage({ type: 'error', text: 'Por favor, corrige los errores en el formulario.' });
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-100 font-poppins text-gray-800">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-full lg:max-w-4xl w-full my-5">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-green-600 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center sm:text-left">Registrar Nuevo Estudiante</h1>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 ease-in-out"
          >
            Cerrar Sesión
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
            <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className={`mb-2 md:mb-0 ${errors.student_id ? 'text-red-600' : ''}`}>
                <label htmlFor="student_id" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">ID del Estudiante <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="student_id"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="Ej: 12345"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.student_id ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.student_id && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.student_id}</span>}
              </div>
              <div className={`mb-2 md:mb-0 ${errors.f_name ? 'text-red-600' : ''}`}>
                <label htmlFor="f_name" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Primer Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="f_name"
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.f_name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.f_name && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.f_name}</span>}
              </div>
              <div className="mb-2 md:mb-0">
                <label htmlFor="m_name" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Segundo Nombre (opcional)</label>
                <input
                  type="text"
                  id="m_name"
                  name="m_name"
                  value={formData.m_name}
                  onChange={handleChange}
                  placeholder="Ej: Carlos"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <div className={`mb-2 md:mb-0 ${errors.f_lastname ? 'text-red-600' : ''}`}>
                <label htmlFor="f_lastname" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Primer Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="f_lastname"
                  name="f_lastname"
                  value={formData.f_lastname}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.f_lastname ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.f_lastname && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.f_lastname}</span>}
              </div>
              <div className="mb-2 md:mb-0">
                <label htmlFor="s_lastname" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Segundo Apellido (opcional)</label>
                <input
                  type="text"
                  id="s_lastname"
                  name="s_lastname"
                  value={formData.s_lastname}
                  onChange={handleChange}
                  placeholder="Ej: García"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
              <div className={`mb-2 md:mb-0 ${errors.dob ? 'text-red-600' : ''}`}>
                <label htmlFor="dob" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.dob && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.dob}</span>}
              </div>
              <div className={`mb-2 md:mb-0 ${errors.password ? 'text-red-600' : ''}`}>
                <label htmlFor="password" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Contraseña Inicial <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña para el estudiante"
                  required
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.password && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.password}</span>}
              </div>
              <div className={`mb-2 md:mb-0 ${errors.country_id ? 'text-red-600' : ''}`}>
                <label htmlFor="country_id" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">País <span className="text-red-500">*</span></label>
                <select
                  id="country_id"
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.country_id ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                >
                  <option value="">Selecciona un país</option>
                  <option value="1">Guatemala</option>
                  <option value="2">El Salvador</option>
                  <option value="3">Honduras</option>
                </select>
                {errors.country_id && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.country_id}</span>}
              </div>
            </div>
          </div>
          <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
            <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className={`mb-2 md:mb-0 ${errors.email ? 'text-red-600' : ''}`}>
                <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Correo Electrónico <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: juan.perez@example.com"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.email && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.email}</span>}
              </div>
              <div className={`mb-2 md:mb-0 ${errors.phone ? 'text-red-600' : ''}`}>
                <label htmlFor="phone" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Número de Teléfono <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 555-123-4567 o +502 1234 5678"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.phone && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.phone}</span>}
              </div>
            </div>
          </div>
          <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
            <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">Información Académica</h2>
            <div className={`mb-2 md:mb-0 ${errors.school_id ? 'text-red-600' : ''}`}>
              <label htmlFor="school_id" className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">Escuela <span className="text-red-500">*</span></label>
              <select
                id="school_id"
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.school_id ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
              >
                <option value="">Selecciona una escuela</option>
                <option value="1">Escuela Primaria Central</option>
                <option value="2">Instituto Nacional de Bachillerato</option>
                <option value="3">Colegio Bilingüe San Juan</option>
                <option value="4">Universidad del Sol</option>
              </select>
              {errors.school_id && <span className="text-red-600 text-xs sm:text-sm mt-1 block">{errors.school_id}</span>}
            </div>
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Registrar Estudiante
            </button>
          </div>

          {submissionMessage.text && (
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center font-bold text-sm sm:text-base ${submissionMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
              {submissionMessage.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;