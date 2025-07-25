import { useNavigate } from "react-router-dom";
import { login } from "../axios/auth";
import { profile } from "../axios/profile";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const email = e.target.email.value;
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Por favor, introduce un correo electrónico válido.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.target);
      const body = Object.fromEntries(formData.entries());
      const { data, status } = await login(body);

      if (status === 200) {
        localStorage.setItem("token", data.token);
        try {
          const { data: me, status: s2 } = await profile();
          if (s2 === 200) {
            localStorage.setItem("userId", me.id);
            navigate("/Home", { state: { profile: me } });
          } else {
            setErrorMsg("Error al cargar el perfil.");
          }
        } catch (error) {
          setErrorMsg("Error al cargar el perfil.");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Correo o contraseña incorrectos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4 bg-cover bg-center"
    >
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-2xl p-8 sm:p-10 backdrop-blur-md">
        <div className="flex justify-center mb-8">

        </div>

        <h2 className="text-3xl font-extrabold text-center text-[#023866] mb-6">
          Inicia Sesión
        </h2>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2c7ee2] focus:border-[#2c7ee2] text-gray-700"
              placeholder="tu_correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2c7ee2] focus:border-[#2c7ee2] text-gray-700"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-[#2c7ee2] hover:bg-[#023866] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2c7ee2] focus:ring-opacity-75"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-[#023866] font-medium hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}