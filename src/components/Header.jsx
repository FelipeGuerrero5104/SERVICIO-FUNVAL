// src/components/Header.jsx
import { useAuth } from "../context/AuthContext";
import { logout as logoutRequest } from "../axios/auth";
import { useNavigate } from "react-router";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user.role?.name || "Usuario";
  const firstName = user.f_name || "Usuario";

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

  return (
    <nav className="bg-[#023866] p-4 text-white flex flex-col md:flex-row items-center justify-between shadow-md">
      <button
        onClick={handleLogout}
        className="bg-[#2c7ee2] hover:bg-blue-400 text-white text-sm font-semibold py-2 px-5 rounded-lg"
      >
        Cerrar Sesión
      </button>
      <div className="text-center md:text-left mt-2 md:mt-0">
        <h2 className="text-md md:text-lg font-semibold">
          Bienvenido, <span className="text-yellow-300">{firstName}</span>
          <span className="ml-2 text-sm font-normal text-gray-300">
            ({role})
          </span>
        </h2>
      </div>
    </nav>
  );
}
