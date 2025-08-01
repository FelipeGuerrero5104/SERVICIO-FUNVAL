import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    const email = body.email;
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Por favor, introduce un correo electrónico válido.");
      setLoading(false);
      return;
    }

    try {
      await login(body);
      navigate("/home");
    } catch (error) {
      setErrorMsg("Correo o contraseña incorrectos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setErrorMsg(`Inicio de sesión con ${provider} no disponible actualmente.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 bg-cover bg-center">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-2xl p-8 sm:p-10 backdrop-blur-md">
        <div className="flex justify-center mb-8">
          {/* Aquí puedes insertar un logo si deseas */}
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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

            className="w-full flex justify-center items-center bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2c7ee2] focus:ring-opacity-75"

          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleSocialLogin("GitHub")}
            disabled={loading}
            className="w-full flex justify-center items-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-75 disabled:opacity-50"
          >
            <FaGithub className="mr-2 h-5 w-5" />
            Iniciar Sesión con GitHub
          </button>
          <button
            onClick={() => handleSocialLogin("Google")}
            disabled={loading}
            className="w-full flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2c7ee2] focus:ring-opacity-75 disabled:opacity-50"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Iniciar Sesión con Google
          </button>
          <button
            onClick={() => handleSocialLogin("Cuenta de la Iglesia")}
            disabled={loading}
            className="w-full flex justify-center items-center bg-[#007DA5] hover:bg-[#005F7F] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#007DA5] focus:ring-opacity-75 disabled:opacity-50"
          >
            <img
              src="https://edge.fscdn.org/assets/static/media/church-symbol-new-46.7b4e672a10b119f73cf1.png"
              alt="Church Account"
              className="mr-2 h-5 w-5"
            />
            Continúa con Cuenta de la Iglesia
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-[#023866] font-medium hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
