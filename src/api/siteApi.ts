import axios from "axios";

import type { Site, SiteFull } from "../models/siteModels";
import httpClient from "./interceptor/httpClient";
export const getSites = async (): Promise<Site[]> => {
  try {
    const response = await httpClient.get<Site[]>("/sites");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        throw new Error("Credenciales no accesicles");
      } else if (status && status >= 500) {
        throw new Error("Error del servidor");
      }

      if (error.request) {
        throw new Error("No se pudo conectar con le servidor");
      }

      throw new Error("Error desconocido");
    }
    throw new Error("Error inesperado en la aplicación");
  }
};

export const getFullSites = async (): Promise<SiteFull[]> => {
  try {
    const response = await httpClient.get<SiteFull[]>("/sites/full/");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        throw new Error("Credenciales no accesicles");
      } else if (status && status >= 500) {
        throw new Error("Error del servidor");
      }

      if (error.request) {
        throw new Error("No se pudo conectar con le servidor");
      }

      throw new Error("Error desconocido");
    }
    throw new Error("Error inesperado en la aplicación");
  }
};

export const refreshSites = async () => {
  try {
    const response = await httpClient.post("/sites/refresh/");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        throw new Error("Credenciales no accesicles");
      } else if (status && status >= 500) {
        throw new Error("Error del servidor");
      }

      if (error.request) {
        throw new Error("No se pudo conectar con le servidor");
      }

      throw new Error("Error desconocido");
    }
    throw new Error("Error inesperado en la aplicación");
  }
};
