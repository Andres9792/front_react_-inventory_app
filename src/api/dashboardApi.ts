import axios from "axios";
import type { DashboardData } from "../models/charts";
import httpClient from "./interceptor/httpClient";

export const getDashboardMetrics = async (): Promise<DashboardData> => {
  try {
    const response = await httpClient.get<DashboardData>("/sites/metrics");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) throw new Error("Credenciales no accesibles");
      if (status && status >= 500) throw new Error("Error del servidor");
      if (error.request) throw new Error("No se pudo conectar con el servidor");

      throw new Error("Error desconocido");
    }
    throw new Error("Error inesperado en la aplicación");
  }
};
