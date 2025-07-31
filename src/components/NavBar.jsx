import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutRequest } from "../axios/auth";
import { ROLES } from "../constants/roles";
import useClickOutside from "../Hooks/useClickOutside";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const { user, logout } = useAuth();
  const menuRef = useRef(null);

  const role = user?.role?.name || ROLES.STUDENT;
  const firstName = user?.f_name?.trim() || "Usuario";

  useEffect(() => {
    if (user?.f_name) {
      let initials = user.f_name[0]?.toUpperCase() || "";
      if (user?.f_lastname) {
        initials += user.f_lastname[0]?.toUpperCase() || "";
      }
      setUserInitials(initials);
    }
  }, [user]);

  useClickOutside(menuRef, () => {
    setIsProfileOpen(false);
  });

  const handleLogout = async () => {
    try {
      const { status } = await logoutRequest();
      if (status === 200) {
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleStudentServices = () => {
    navigate("/servicios/crear");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <Link to="/home" className="flex items-center">
        <img className="h-12" src="/logo.png" alt="logo" />
      </Link>

      <div className="flex items-center space-x-6">
        {location.pathname !== "/home" && (
          <Link
            to="/home"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === "/home"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            Inicio
          </Link>
        )}

        {role === ROLES.ADMIN && (
          <>
            {location.pathname !== "/servicios" && (
              <Link
                to="/servicios"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/servicios"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Servicios
              </Link>
            )}
            {location.pathname !== "/categorias" && (
              <Link
                to="/categorias"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/categorias"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Categorías
              </Link>
            )}
            {location.pathname !== "/usuarios" && (
              <Link
                to="/usuarios"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/usuarios"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Usuarios
              </Link>
            )}
          </>
        )}

        {role === ROLES.CONTROLLER && (
          <>
            {location.pathname !== "/reportes" && (
              <Link
                to="/reportes"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/reportes"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Reportes
              </Link>
            )}
            {location.pathname !== "/validaciones" && (
              <Link
                to="/validaciones"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/validaciones"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Validaciones
              </Link>
            )}
          </>
        )}

        {role === ROLES.RECRUITER && (
          <>
            {location.pathname !== "/candidatos" && (
              <Link
                to="/candidatos"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/candidatos"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Candidatos
              </Link>
            )}
            {location.pathname !== "/vacantes" && (
              <Link
                to="/vacantes"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/vacantes"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Vacantes
              </Link>
            )}
          </>
        )}

        {role === ROLES.STUDENT && location.pathname !== "/servicios/crear" && (
          <button
            onClick={handleStudentServices}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Agregar Servicios
          </button>
        )}
      </div>

      {user && (
        <div className="relative flex items-center space-x-4" ref={menuRef}>
          <button
            onClick={() => navigate("/perfil")}
            className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Mi perfil</span>
          </button>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>

          {/* Menú móvil/compacto */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none md:hidden"
            aria-label="Menú de usuario"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {userInitials}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 divide-y divide-gray-100 md:hidden">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{firstName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div>
                <button
                  onClick={() => {
                    navigate("/perfil");
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Ver perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 hover:text-red-800 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {/* Avatar para desktop con menú desplegable */}
          <div className="hidden md:block">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full text-white font-bold shadow-sm focus:outline-none"
              aria-label="Menú de usuario"
            >
              {userInitials}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {firstName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mi perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
