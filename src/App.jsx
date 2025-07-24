import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { profile } from "./axios/profile";

function App() {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data, status } = await profile();
        if (status === 200) setProfileData(data);
      } catch (err) {
        console.error("Error cargando perfil en App:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/profile"
        element={<Profile profileData={location.state?.profile ?? profileData} />}
      />
    </Routes>
  );
}

export default App;