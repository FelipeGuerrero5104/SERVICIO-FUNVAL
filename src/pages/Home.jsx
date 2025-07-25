// src/pages/Home.jsx
import Header from "../components/Header";
import PerfilUsuario from "../components/TraerUsuarios/PerfilUsuario";
import ListaUsuarios from "../components/TraerUsuarios/UsuariosList";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const firstName = user?.f_name || "Usuario";

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Header />

      <main className="p-6 max-w-6xl mx-auto mt-10">
        {user?.role?.name === "Admin" ? (
          <ListaUsuarios/>
        ) : (
          <PerfilUsuario />

        )}
      </main>
    </div>
  );
}
