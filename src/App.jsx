import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-white">Cargando sesión...</p>;
  return (
   
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
    </Routes>
    <Footer></Footer>
    </>
  );
}
