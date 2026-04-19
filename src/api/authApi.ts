import axios from "axios";
import type { LoginRequest, LoginResponse } from "../models/auth";
import { config } from "../config/config";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post(
      `${config.API_URL_BASE}/login/`,
      credentials,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    if (!data.access || !data.refresh) {
      throw new Error("Respuesta inválida del servidor");
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        throw new Error(
          "Credenciales incorrectas. Verifica tu usuario o contraseña."
        );
      }

      if (status && status >= 500) {
        throw new Error("Error del servidor. Intenta nuevamente más tarde.");
      }

      if (error.request) {
        // No hubo respuesta del servidor
        throw new Error(
          "No se pudo conectar con el servidor. Verifica tu red."
        );
      }

      throw new Error(`Error desconocido (${status ?? "sin status"})`);
    }

    // Si NO es un error de Axios
    throw new Error("Error inesperado en la aplicación");
  }
};
