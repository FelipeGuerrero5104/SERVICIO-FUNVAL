import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutRequest } from "../axios/auth";
import { ROLES } from "../constants/roles";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const { user, logout } = useAuth();

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
    <nav className="flex items-center justify-between px-8  bg-white shadow-md">
      <Link to="/home" className="text-2xl font-bold text-blue-600">
        <img className="h-[70px]" src="/logo.png" alt="logo" />
      </Link>

      <div className="flex space-x-8">
        {location.pathname !== "/home" && (
          <Link
            to="/home"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </Link>
        )}

        {role === ROLES.ADMIN && (
          <>
            {location.pathname !== "/servicios" && (
              <Link
                to="/servicios"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Servicios
              </Link>
            )}
            {location.pathname !== "/categorias" && (
              <Link
                to="/categorias"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Categorías
              </Link>
            )}
            {location.pathname !== "/usuarios" && (
              <Link
                to="/usuarios"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
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
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Reportes
              </Link>
            )}
            {location.pathname !== "/validaciones" && (
              <Link
                to="/validaciones"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
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
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Candidatos
              </Link>
            )}
            {location.pathname !== "/vacantes" && (
              <Link
                to="/vacantes"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Vacantes
              </Link>
            )}
          </>
        )}

        {role === ROLES.STUDENT && location.pathname !== "/servicios/crear" && (
          <button
            onClick={handleStudentServices}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Agregar Servicios
          </button>
        )}
      </div>

      {user && (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="Menú de usuario"
          >
            <span className="text-gray-700">Hola, {firstName}</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {userInitials}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={() => {
                  navigate("/perfil");
                  setIsProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Ver perfil
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 hover:text-red-800 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
