
import Header from "../components/Header";
import StudentDashboard from "../components/StudentDashboard"; // Nuevo componente
import PerfilUsuario from "../components/TraerUsuarios/PerfilUsuario";
import ListaUsuarios from "../components/TraerUsuarios/UsuariosList";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6 max-w-6xl mx-auto mt-10">
        {user?.role?.name === "Admin" ? (
          <ListaUsuarios />
        ) : (
          <StudentDashboard />
        )}

      </main>
    </div>
  );
}
