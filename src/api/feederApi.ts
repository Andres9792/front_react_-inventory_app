import axios from "axios";
import httpClient from "./interceptor/httpClient";
import type { SF200Response } from "../models/feeders";

export const getsf200Responses = async (
  ips: string[]
): Promise<SF200Response[]> => {
  try {
    const response = await httpClient.post<SF200Response[]>(
      "/sites/read/",
      { ips },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 150000,
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        throw new Error("Credenciales no accesibles");
      } else if (status && status >= 500) {
        throw new Error("Error del servidor");
      }

      if (error.request) {
        throw new Error("No se pudo conectar con el servidor");
      }

      throw new Error("Error desconocido");
    }

    throw new Error("Error inesperado en la aplicación");
  }
};
