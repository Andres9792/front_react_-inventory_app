import axios from "axios";
import type { Proxmox } from "../models/proxmox";
import httpClient from "./interceptor/httpClient";

export const getProxmoxSites = async (): Promise<Proxmox[]> => {
  try {
    const response = await httpClient.get<Proxmox[]>("/proxmox/");

    return response.data;
  } catch (error) {
    console.log("error api", error);
  }

  return [];
};

export const updateProxmoxApi = async (
  id: number,
  data: Partial<Proxmox>
): Promise<Proxmox> => {
  try {
    const response = await httpClient.patch<Proxmox>(
      `/proxmox/update/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar Proxmox"
      );
    }
    throw new Error("Error inesperado");
  }
};

type ApiError = { detail?: string };

export const createProxmox = async (data: unknown) => {
  try {
    // 🔹 Realizamos el POST al backend
    const response = await httpClient.post<Proxmox>("/proxmox/create/", data);
    return response.data;

    console.log(" Registro creado correctamente:", response.data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverDetail = (error.response?.data as ApiError | undefined)
        ?.detail;

      const status = error.response?.status;

      if (status === 400) throw new Error(serverDetail || "Datos inválidos");
      if (status === 401) throw new Error("No autorizado");
      if (status && status >= 500) throw new Error("Error del servidor");

      if (error.request) throw new Error("No hubo respuesta del servidor.");

      throw new Error(serverDetail || "Error al crear Proxmox");
    }

    throw new Error("Error inesperado");
  }
};
