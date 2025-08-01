import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutRequest } from "../axios/auth";
import { ROLES } from "../constants/roles";
import useClickOutside from "../Hooks/useClickOutside";
import DarkMode from "./DarkMode";

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
    <nav className="flex items-center justify-between md:px-6 py-3 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 dark:bg-[#121212] dark:border-gray-800">
      <Link to="/home" className="flex items-center">
        <img className="h-12" src="/logo.png" alt="logo" />
      </Link>
      <DarkMode className="border"></DarkMode>

      {user && (
        <div className="relative flex items-center space-x-4" ref={menuRef}>
          <span className="hidden md:block text-gray-700 dark:text-[#e0e0e0]">
            Hola,{" "}
            <span className="font-bold text-[#0d47a1] dark:text-[#ffb400]">
              {firstName}
            </span>{" "}
            ({role})
          </span>

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
            <div className="absolute right-0 mt-50 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 divide-y divide-gray-100 dark:divide-gray-700 dark:bg-[#181818] dark:border-[#121212] md:hidden">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-[#2196f3]">
                  {firstName}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    navigate("/perfil");
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer dark:text-white dark:hover:bg-[#2b2b2b]"
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
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200 text-red-600 hover:text-red-800 transition-colors cursor-pointer dark:hover:bg-[#2b2b2b]"
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
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 divide-y divide-gray-100 dark:divide-gray-700 dark:bg-[#181818] dark:border-[#121212]">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-[#2196f3]">
                    {firstName}
                  </p>
                  <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer dark:text-white dark:hover:bg-[#2b2b2b]"
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
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200 text-red-600 hover:text-red-800 transition-colors cursor-pointer dark:hover:bg-[#2b2b2b]"
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
