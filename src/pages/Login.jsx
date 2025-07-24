import React, { useState } from "react";
import { login } from "../libs/axios/auth";

export const Login = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    try {
      // Asegurémonos de que los datos se envíen como JSON
      const response = await login({
        email: body.email,
        password: body.password,
      });

      console.log("Respuesta del servidor:", response);

      if (response.data.status === "success") {
        console.log("Login exitoso!");
      } else {
        setError(response.data.message || "Error desconocido");
      }
    } catch (error) {
      // Limpiamos los warnings PHP del mensaje de error
      const errorMessage =
        error.response?.data?.message || "Error al conectar con el servidor";
      setError(errorMessage);
      console.error("Error completo:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Entrar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};
