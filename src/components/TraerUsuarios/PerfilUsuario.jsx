import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../../axios/axiosConfig";
import { HiArrowUp } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa";

const PerfilUsuario = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState({
    type: "",
    text: "",
  });

  const fullName = [
    user?.f_name,
    user?.m_name,
    user?.f_lastname,
    user?.s_lastname,
  ]
    .filter(Boolean)
    .join(" ");

  const userInfo = [
    { label: "Nombre Completo", value: fullName || "No disponible" },
    { label: "Correo Electrónico", value: user?.email || "No disponible" },
    { label: "Teléfono", value: user?.phone || "No disponible" },
    { label: "Rol", value: user?.role?.name || "No disponible" },
    { label: "ID de Usuario", value: user?.id || "No disponible" },
    ...(user?.role?.name === "Student"
      ? [
          {
            label: "Escuela",
            value: user?.school?.name || "No asignada. Actualiza tu perfil.",
          },
        ]
      : []),
    { label: "Curso Estudiando", value: user?.course || "No especificado" },
  ];

  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setSubmissionMessage({
          type: "error",
          text: "Solo se permiten imágenes JPEG o PNG.",
        });
        setProfilePicture(null);
        setPreviewImage(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setSubmissionMessage({
          type: "error",
          text: "La imagen no debe exceder los 5MB.",
        });
        setProfilePicture(null);
        setPreviewImage(null);
        return;
      }
      setProfilePicture(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
      setSubmissionMessage({ type: "", text: "" });
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    try {
      const { status } = await instance.patch(`/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (status === 200 || status === 201) {
        setSubmissionMessage({
          type: "success",
          text: "Foto de perfil actualizada exitosamente.",
        });
        setProfilePicture(null);
        setPreviewImage(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSubmissionMessage({
          type: "error",
          text: "Sesión expirada. Por favor, inicia sesión nuevamente.",
        });
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Error al subir la foto de perfil.";
        setSubmissionMessage({ type: "error", text: errorMessage });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-900 md:pt-20">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-lg overflow-hidden dark:bg-[#2b2b2b] ">
          <div className="bg-gradient-to-br from-[#0d47a1] to-[#082342] h-24 relative flex items-center justify-center">
            <button
              onClick={() => navigate("/home")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300"
              title="Volver"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-white text-xl font-bold">Mi Perfil</h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            <img
              src={
                previewImage ||
                user?.profile_picture ||
                "https://placehold.co/150"
              }
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover "
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center dark:text-[#ffb400]">
              {fullName}
            </h3>
            <div className="mt-6 w-full flex flex-col items-center">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleProfilePictureChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100  dark:text-gray-400 dark:file:text-[#1e88e5] dark:file:font-bold dark:file:bg-[#2b2b2b]"
              />
              <button
                onClick={handleProfilePictureUpload}
                disabled={uploading || !profilePicture}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition disabled:opacity-50"
              >
                <HiArrowUp className="h-5 w-5" />
                {uploading ? "Subiendo..." : "Actualizar Foto"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white shadow-xl rounded-lg overflow-hidden dark:bg-[#2b2b2b] ">
          <div className="bg-gradient-to-br from-[#0d47a1] to-[#082342] h-24 flex items-center justify-center">
            <h2 className="text-white text-xl font-bold">
              Información Personal
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 ">
            {userInfo.map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-sm font-semibold text-gray-600 mb-1 dark:text-white">
                  {label}
                </span>
                <span className="text-base text-gray-800 dark:text-gray-400">
                  {value}
                </span>
              </div>
            ))}
          </div>
          {submissionMessage.text && (
            <div className="p-6">
              <p
                className={`text-center text-sm font-medium ${
                  submissionMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submissionMessage.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
