import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaGithub, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiShieldUserFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeBackground, setActiveBackground] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);

  const backgrounds = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  ];

  useEffect(() => {
    // Cambio de fondo cada 8 segundos
    const interval = setInterval(() => {
      setActiveBackground((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    // Inicializar partículas
    initParticles();

    return () => clearInterval(interval);
  }, []);

  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  };

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

  // Efecto de luz para el botón principal
  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const handleMove = (e) => {
      const x = e.pageX - button.offsetLeft;
      const y = e.pageY - button.offsetTop;

      button.style.setProperty("--x", `${x}px`);
      button.style.setProperty("--y", `${y}px`);
    };

    button.addEventListener("mousemove", handleMove);
    return () => button.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{
        transition: "background 1.5s ease-in-out",
        background: backgrounds[activeBackground],
      }}
    >
      {/* Canvas para partículas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Efecto de burbujas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() > 0.5 ? 50 : -50],
              x: [0, Math.random() > 0.5 ? 30 : -30],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="relative">
          {/* Tarjeta de login */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/90 rounded-2xl shadow-2xl p-8 sm:p-10 backdrop-blur-md border border-white/20 relative overflow-hidden"
          >
            {/* Efecto de brillo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute -inset-2 bg-white/30 rounded-xl blur-md"
                style={{
                  animation: "pulse 6s infinite alternate",
                }}
              />
            </div>

            {/* Logo animado */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                  <RiShieldUserFill className="text-white text-2xl" />
                </div>
                <motion.div
                  className="absolute -inset-2 border-2 border-blue-400 rounded-full opacity-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900 mb-6"
            >
              Bienvenido de vuelta
            </motion.h2>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 text-sm text-red-600 text-center font-medium px-4 py-2 bg-red-50 rounded-lg"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="tu_correo@ejemplo.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden flex justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    "--x": "0px",
                    "--y": "0px",
                  }}
                >
                  {isHovered && (
                    <span
                      className="absolute inset-0 bg-white/20 pointer-events-none"
                      style={{
                        borderRadius: "inherit",
                        background: `radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.3), transparent 80%)`,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        Acceder ahora <FaArrowRight className="ml-2" />
                      </>
                    )}
                  </span>
                </button>
              </motion.div>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">
                  O continúa con
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <motion.div
                className="mt-6 grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin("GitHub")}
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 disabled:opacity-50 shadow"
                >
                  <FaGithub className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin("Google")}
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 disabled:opacity-50 border border-gray-300 shadow"
                >
                  <FcGoogle className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin("Cuenta de la Iglesia")}
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 shadow"
                >
                  <RiShieldUserFill className="h-5 w-5" />
                </motion.button>
              </motion.div>
            </div>

            <motion.p
              className="mt-8 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              ¿No tienes una cuenta?{" "}
              <a
                href="/register"
                className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors duration-200"
              >
                Regístrate aquí
              </a>
            </motion.p>
          </motion.div>

          {/* Efecto de reflejo */}
          <div className="absolute -bottom-10 left-0 right-0 h-10 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-sm rounded-b-2xl opacity-70"></div>
        </div>
      </motion.div>

      {/* Efectos de luz adicionales */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl opacity-20 animate-float-delay"></div>
      </div>

      {/* Estilos globales inline */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.1; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(0.95); }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes float-delay {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(30px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite 2s; }
      `}</style>
    </div>
  );
}
