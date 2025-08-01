import React, { useState, useEffect } from "react";
import { ROLES } from "../constants/roles";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const API_BASE_URL = "https://www.hs-service.api.crealape.com/api/v1";

const StudentRegistrationForm = ({ currentUserId }) => {
  const [formData, setFormData] = useState({
    f_name: "",
    m_name: "",
    f_lastname: "",
    s_lastname: "",
    email: "",
    password: "",
    role: "",
    school_id: "",
    country_id: "",
    controller_id: "",
    recruiter_id: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState({
    type: "",
    text: "",
  });
  const [controllers, setControllers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [schools, setSchools] = useState([]);
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [roleIdMap, setRoleIdMap] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      let controllerRoleId = null;
      let recruiterRoleId = null;

      try {
        const rolesResponse = await fetch(`${API_BASE_URL}/roles`, {
          credentials: "include",
        });
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          setRoles(rolesData);

          const mapping = {};
          rolesData.forEach((role) => {
            if (role.name === "Admin") mapping[ROLES.ADMIN] = role.id;
            if (role.name === "Controller") {
              mapping[ROLES.CONTROLLER] = role.id;
              controllerRoleId = role.id;
            }
            if (role.name === "Recruiter") {
              mapping[ROLES.RECRUITER] = role.id;
              recruiterRoleId = role.id;
            }
            if (role.name === "Student") mapping[ROLES.STUDENT] = role.id;
          });
          setRoleIdMap(mapping);
          console.log("roleIdMap:", mapping); // Depuración
        } else {
          console.error("Error fetching roles:", rolesResponse.status);
          setRoleIdMap({
            [ROLES.ADMIN]: 1,
            [ROLES.CONTROLLER]: 2,
            [ROLES.RECRUITER]: 3,
            [ROLES.STUDENT]: 4,
          });
          controllerRoleId = 2;
          recruiterRoleId = 3;
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoleIdMap({
          [ROLES.ADMIN]: 1,
          [ROLES.CONTROLLER]: 2,
          [ROLES.RECRUITER]: 3,
          [ROLES.STUDENT]: 4,
        });
        controllerRoleId = 2;
        recruiterRoleId = 3;
      }

      if (controllerRoleId) {
        try {
          const controllersResponse = await fetch(
            `${API_BASE_URL}/users?r=${controllerRoleId}`,
            { credentials: "include" }
          );
          if (controllersResponse.ok) {
            const controllersData = await controllersResponse.json();
            setControllers(controllersData);
          }
        } catch (error) {
          console.error("Error fetching controllers:", error);
        }
      }

      if (recruiterRoleId) {
        try {
          const recruitersResponse = await fetch(
            `${API_BASE_URL}/users?r=${recruiterRoleId}`,
            { credentials: "include" }
          );
          if (recruitersResponse.ok) {
            const recruitersData = await recruitersResponse.json();
            setRecruiters(recruitersData);
          }
        } catch (error) {
          console.error("Error fetching recruiters:", error);
        }
      }

      try {
        const schoolsResponse = await fetch(`${API_BASE_URL}/schools/`, {
          credentials: "include",
        });
        if (schoolsResponse.ok) {
          const schoolsData = await schoolsResponse.json();
          setSchools(schoolsData);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }

      try {
        const countriesResponse = await fetch(`${API_BASE_URL}/countries`, {
          credentials: "include",
        });
        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json();
          setCountries(countriesData);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "role") {
      if (value === ROLES.ADMIN) {
        setFormData((prev) => ({
          ...prev,
          role: value,
          school_id: "",
          country_id: "",
          controller_id: "",
          recruiter_id: "",
        }));
      } else if (value === ROLES.CONTROLLER || value === ROLES.RECRUITER) {
        setFormData((prev) => ({
          ...prev,
          role: value,
          controller_id: "",
          recruiter_id: "",
        }));
      } else if (value === ROLES.STUDENT) {
        setFormData((prev) => ({
          ...prev,
          role: value,
        }));
      }
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.f_name.trim()) {
      newErrors.f_name = "El primer nombre es obligatorio.";
      isValid = false;
    }
    if (!formData.f_lastname.trim()) {
      newErrors.f_lastname = "El primer apellido es obligatorio.";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Ingresa un correo electrónico válido.";
      isValid = false;
    }
    if (!formData.role) {
      newErrors.role = "Selecciona un rol.";
      isValid = false;
    }

    if (
      formData.role === ROLES.CONTROLLER ||
      formData.role === ROLES.RECRUITER ||
      formData.role === ROLES.STUDENT
    ) {
      if (!formData.school_id) {
        newErrors.school_id = "Selecciona una escuela.";
        isValid = false;
      }
      if (!formData.country_id) {
        newErrors.country_id = "Selecciona un país.";
        isValid = false;
      }
    }

    if (formData.role === ROLES.STUDENT) {
      if (!formData.controller_id) {
        newErrors.controller_id = "Selecciona un controller.";
        isValid = false;
      }
      if (!formData.recruiter_id) {
        newErrors.recruiter_id = "Selecciona un recruiter.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage({ type: "", text: "" });

    if (!validateForm()) {
      setSubmissionMessage({
        type: "error",
        text: "Por favor, corrige los errores en el formulario.",
      });
      return;
    }

    if (!roleIdMap[formData.role]) {
      setSubmissionMessage({
        type: "error",
        text: `Error: No se pudo obtener el ID del rol para ${formData.role}. Por favor, recarga la página.`,
      });
      console.error("roleIdMap missing for role:", formData.role, roleIdMap);
      return;
    }

    const userData = {
      f_name: formData.f_name,
      m_name: formData.m_name || "",
      f_lastname: formData.f_lastname,
      s_lastname: formData.s_lastname || "",
      email: formData.email,
      password: formData.password,
      role_id: roleIdMap[formData.role],
      status: formData.status,
      schools: [], // Siempre incluir schools, incluso vacío, para cumplir con el backend
    };

    // Incluir schools y country_id solo si son necesarios
    if (
      formData.role === ROLES.CONTROLLER ||
      formData.role === ROLES.RECRUITER ||
      formData.role === ROLES.STUDENT
    ) {
      if (formData.school_id) {
        userData.schools = [parseInt(formData.school_id)];
      }
      if (formData.country_id) {
        userData.country_id = parseInt(formData.country_id);
      }
    }

    if (formData.role === ROLES.STUDENT) {
      if (formData.controller_id) {
        userData.controller_id = parseInt(formData.controller_id);
      }
      if (formData.recruiter_id) {
        userData.recruiter_id = parseInt(formData.recruiter_id);
      }
    }

    console.log("Submitting userData:", userData); // Depuración

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setSubmissionMessage({
            type: "success",
            text: `Usuario registrado exitosamente: ${data.email}`,
          });
        } else {
          setSubmissionMessage({
            type: "success",
            text: "Usuario registrado exitosamente (sin contenido JSON).",
          });
        }
        setFormData({
          f_name: "",
          m_name: "",
          f_lastname: "",
          s_lastname: "",
          email: "",
          password: "",
          role: "",
          school_id: "",
          country_id: "",
          controller_id: "",
          recruiter_id: "",
          status: "active",
        });
        setErrors({});
      } else {
        let errorMessage = `Error en el registro: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = `Error en el registro: ${response.status} - ${
            errorData.message || errorData.detail || JSON.stringify(errorData)
          }`;
        } catch (parseError) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
        }
        setSubmissionMessage({ type: "error", text: errorMessage });
      }
    } catch (error) {
      setSubmissionMessage({
        type: "error",
        text: `Error de red o del servidor: ${error.message}`,
      });
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-100 font-poppins text-gray-800 dark:bg-slate-900">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-full lg:max-w-4xl w-full my-5 dark:bg-[#2b2b2b]">
        <div className="sm:mt-0 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="absolute mt-2 p-2 px-2 sm:p-4 sm:mt-6 rounded transform -translate-y-1/2 text-white bg-green-600 text-lg hover:text-gray-300 flex items-center gap-1"
            title="Volver al inicio"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-green-600 pt-10 sm:pt-0 text-xl sm:text-3xl lg:text-4xl font-extrabold text-end md:text-center dark:text-[#ffb400]">
            Registrar Nuevo Usuario
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 dark:border-gray-700">
              <h2 className="dark:text-[#1e88e5] mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300 dark:border-gray-700">
                Rol del Usuario
              </h2>
              <div
                className={`mb-2 md:mb-0 ${errors.role ? "text-red-600" : ""}`}
              >
                <label
                  htmlFor="role"
                  className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                >
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-500 ${
                    errors.role
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out dark:bg-[#222222]`}
                >
                  <option value="">Selecciona un rol</option>
                  <option value={ROLES.ADMIN}>Administrador</option>
                  <option value={ROLES.CONTROLLER}>Controller</option>
                  <option value={ROLES.RECRUITER}>Recruiter</option>
                  <option value={ROLES.STUDENT}>Estudiante</option>
                </select>
                {errors.role && (
                  <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                    {errors.role}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 dark:border-gray-700">
              <h2 className="dark:text-[#1e88e5] mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300 dark:border-gray-700">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div
                  className={`mb-2 md:mb-0 ${
                    errors.f_name ? "text-red-600" : ""
                  }`}
                >
                  <label
                    htmlFor="f_name"
                    className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                  >
                    Primer Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="f_name"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleChange}
                    placeholder="Ej: Juan"
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-400 ${
                      errors.f_name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out dark:bg-[#222222]`}
                  />
                  {errors.f_name && (
                    <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                      {errors.f_name}
                    </span>
                  )}
                </div>
                <div className="mb-2 md:mb-0">
                  <label
                    htmlFor="m_name"
                    className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                  >
                    Segundo Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    id="m_name"
                    name="m_name"
                    value={formData.m_name}
                    onChange={handleChange}
                    placeholder="Ej: Carlos"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out dark:text-gray-400 dark:bg-[#222222]"
                  />
                </div>
                <div
                  className={`mb-2 md:mb-0 ${
                    errors.f_lastname ? "text-red-600" : ""
                  }`}
                >
                  <label
                    htmlFor="f_lastname"
                    className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                  >
                    Primer Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="f_lastname"
                    name="f_lastname"
                    value={formData.f_lastname}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-400 dark:bg-[#222222] ${
                      errors.f_lastname
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                  />
                  {errors.f_lastname && (
                    <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                      {errors.f_lastname}
                    </span>
                  )}
                </div>
                <div className="mb-2 md:mb-0">
                  <label
                    htmlFor="s_lastname"
                    className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                  >
                    Segundo Apellido (opcional)
                  </label>
                  <input
                    type="text"
                    id="s_lastname"
                    name="s_lastname"
                    value={formData.s_lastname}
                    onChange={handleChange}
                    placeholder="Ej: García"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out dark:text-gray-400 dark:bg-[#222222]"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8 pb-5 border-b border-gray-200 dark:border-gray-700">
              <div
                className={`mb-2 md:mb-0 ${errors.email ? "text-red-600" : ""}`}
              >
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                >
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: juan.perez@example.com"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-400 dark:bg-[#222222] ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.email && (
                  <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>
              <div
                className={`mb-2 md:mb-0 ${
                  errors.password ? "text-red-600" : ""
                }`}
              >
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña del usuario"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-400 dark:bg-[#222222] ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                />
                {errors.password && (
                  <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>

            {(formData.role === ROLES.CONTROLLER ||
              formData.role === ROLES.RECRUITER ||
              formData.role === ROLES.STUDENT) && (
              <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">
                  Información Adicional
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div
                    className={`mb-2 md:mb-0 ${
                      errors.school_id ? "text-red-600" : ""
                    }`}
                  >
                    <label
                      htmlFor="school_id"
                      className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                    >
                      Escuela <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="school_id"
                      name="school_id"
                      value={formData.school_id}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-600 dark:bg-[#222222] ${
                        errors.school_id ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                    >
                      <option value="">Selecciona una escuela</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                    {errors.school_id && (
                      <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                        {errors.school_id}
                      </span>
                    )}
                  </div>
                  <div
                    className={`mb-2 md:mb-0 ${
                      errors.country_id ? "text-red-600" : ""
                    }`}
                  >
                    <label
                      htmlFor="country_id"
                      className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                    >
                      País <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country_id"
                      name="country_id"
                      value={formData.country_id}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-600 dark:bg-[#222222] ${
                        errors.country_id ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                    >
                      <option value="">Selecciona un país</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country_id && (
                      <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                        {errors.country_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formData.role === ROLES.STUDENT && (
              <div className="mb-8 pb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                <h2 className="text-blue-600 mb-5 text-xl sm:text-2xl font-semibold border-b-2 pb-2 border-gray-300">
                  Asignación de Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div
                    className={`mb-2 md:mb-0 ${
                      errors.controller_id ? "text-red-600" : ""
                    }`}
                  >
                    <label
                      htmlFor="controller_id"
                      className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                    >
                      Controller <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="controller_id"
                      name="controller_id"
                      value={formData.controller_id}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-600 dark:bg-[#222222] ${
                        errors.controller_id
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                    >
                      <option value="">Selecciona un controller</option>
                      {controllers.map((controller) => (
                        <option key={controller.id} value={controller.id}>
                          {controller.f_name} {controller.f_lastname}
                        </option>
                      ))}
                    </select>
                    {errors.controller_id && (
                      <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                        {errors.controller_id}
                      </span>
                    )}
                  </div>
                  <div
                    className={`mb-2 md:mb-0 ${
                      errors.recruiter_id ? "text-red-600" : ""
                    }`}
                  >
                    <label
                      htmlFor="recruiter_id"
                      className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 dark:text-gray-300"
                    >
                      Recruiter <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="recruiter_id"
                      name="recruiter_id"
                      value={formData.recruiter_id}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border dark:text-gray-600 dark:bg-[#222222] ${
                        errors.recruiter_id
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-300 ease-in-out`}
                    >
                      <option value="">Selecciona un recruiter</option>
                      {recruiters.map((recruiter) => (
                        <option key={recruiter.id} value={recruiter.id}>
                          {recruiter.f_name} {recruiter.f_lastname}
                        </option>
                      ))}
                    </select>
                    {errors.recruiter_id && (
                      <span className="text-red-600 text-xs sm:text-sm mt-1 block">
                        {errors.recruiter_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-6 sm:mt-8">
              <button
                type="submit"
                className="bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] hover:text-[#ffb400] text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Registrar Usuario
              </button>
            </div>

            {submissionMessage.text && (
              <div
                className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center font-bold text-sm sm:text-base ${
                  submissionMessage.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-red-100 text-red-700 border border-red-400"
                }`}
              >
                {submissionMessage.text}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrationForm;