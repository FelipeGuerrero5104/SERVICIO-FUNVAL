import Header from "../components/Header";
import PerfilUsuario from "../components/TraerUsuarios/PerfilUsuario";
import ListaUsuarios from "../components/TraerUsuarios/UsuariosList";
import { useAuth } from "../context/AuthContext";

export default function Usuarios() {
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6 max-w-6xl mx-auto mt-10">
        {user?.role?.name === "Admin" ? (
          <ListaUsuarios />
        ) : (
          <PerfilUsuario />
        )}
      </main>
    </div>
  );
}