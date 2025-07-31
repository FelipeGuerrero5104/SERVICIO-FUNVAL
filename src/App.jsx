import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import UsuarioDetalle from "./pages/Admin/DetalleUsuario";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import StudentRegistrationForm from "./pages/StudentRegistrationForm";
import Services from "./pages/Services";
import UserServices from "./components/Services/UserServices";
import ChangePassword from "./pages/ChangePassword";
import UpdateProfile from "./pages/UpdateProfile";
import PerfilUsuario from "./components/TraerUsuarios/PerfilUsuario";
import ListaUsuarios from "./components/TraerUsuarios/UsuariosList";


const Categorias = () => <div>Categorías (en desarrollo)</div>;
const Reportes = () => <div>Reportes (en desarrollo)</div>;
const Validaciones = () => <div>Validaciones (en desarrollo)</div>;
const Candidatos = () => <div>Candidatos (en desarrollo)</div>;
const Vacantes = () => <div>Vacantes (en desarrollo)</div>;
const Escuelas = () => <div>Escuelas (en desarrollo)</div>;

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hideNavOnPaths = ["/", "/login"];

  const shouldShowNav = !hideNavOnPaths.includes(location.pathname);

  if (loading) return <p className="text-white">Cargando sesión...</p>;

  return (
    <>
      {shouldShowNav && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/usuarios/:id" element={<PrivateRoute><UsuarioDetalle /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><ListaUsuarios /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />
        <Route path="/servicios" element={<PrivateRoute><Services /></PrivateRoute>} />
        <Route path="/servicios/crear" element={<PrivateRoute><UserServices /></PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
        <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
        <Route path="/validaciones" element={<PrivateRoute><Validaciones /></PrivateRoute>} />
        <Route path="/candidatos" element={<PrivateRoute><Candidatos /></PrivateRoute>} />
        <Route path="/vacantes" element={<PrivateRoute><Vacantes /></PrivateRoute>} />
        <Route path="/escuelas" element={<PrivateRoute><Escuelas /></PrivateRoute>} />
        <Route path="/register" element={<PrivateRoute><StudentRegistrationForm /></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
      </Routes>
      <Footer />
    </>
  );
}