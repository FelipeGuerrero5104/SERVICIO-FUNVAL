import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

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
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer></Footer>
    </>
  );
}
