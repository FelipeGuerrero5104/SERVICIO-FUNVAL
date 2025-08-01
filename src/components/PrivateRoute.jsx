import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!user || !token) return <Navigate to="/login" />;
  return children;
}