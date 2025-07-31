import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "../axios/auth";
import { profile } from "../axios/profile";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserProfile = async () => {
    try {
      const { data } = await profile();
      setUser(data);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    localStorage.setItem("token", data.token);
    await loadUserProfile();
    navigate("/"); // Redirige al home después de iniciar sesión
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, loadUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}