import axios from "axios";
import { config } from "../../config/config";

const httpClient = axios.create({
  baseURL: config.API_URL_BASE,
  timeout: 100000
});

// ============ REQUEST ============
// Agrega access token a cada request
httpClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("access");

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

// ============ RESPONSE ============
// Maneja expiración y refresh automático
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          // No hay refresh → logout forzado
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Pedir nuevo access token
        const res = await axios.post(`${config.API_URL_BASE}/api/token/refresh/`, {
          refresh: refresh
        });

        const newAccess = res.data.access;

        // Guardar nuevo access
        localStorage.setItem("access", newAccess);

        // Reintentar request original con token nuevo
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return httpClient(originalRequest);

      } catch (refreshError) {
        // Refresh falló → logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
