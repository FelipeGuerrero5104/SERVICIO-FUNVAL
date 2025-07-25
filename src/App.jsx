
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentRegistrationForm from "./pages/StudentRegistrationForm";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";

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
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<Login />} />
      <Route
        path="/Home"
        element={<Home profileData={location.state?.profile ?? profileData}/>}
      />
      <Route path="/register" element={<StudentRegistrationForm/>}/>
    </Routes>
  );
}


export default App;