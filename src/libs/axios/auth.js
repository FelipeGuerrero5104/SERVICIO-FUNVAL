import instance from ".";

export const login = async (body) => {
  try {
    const response = await instance.post("/auth/login", body);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      throw {
        status: 503,
        data: { message: "No se recibió respuesta del servidor" },
      };
    } else {
      throw {
        status: 500,
        data: { message: "Error al configurar la petición" },
      };
    }
  }
};
