import axios from "axios";
import { config } from "../config/config";
import type {Proxmox} from "../models/proxmox"


export const getProxmoxSites = async (): Promise<Proxmox[]> =>{
try {
    const response = await axios.get(`${config.API_URL_BASE}/proxmox/`);
    
    return response.data;
} catch (error) {
    console.log("error api",error)
}

 return []
}


export const updateProxmoxApi = async (id: number, data: any) => {
  try {
    const response = await fetch(`${config.API_URL_BASE}/proxmox/update/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar (HTTP ${response.status})`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error en updateProxmox:", error);
    throw error;
  }
};


export const createProxmox = async (data: any) => {
  try {
    // 🔹 Realizamos el POST al backend
    const response = await axios.post(`${config.API_URL_BASE}/proxmox/create/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(" Registro creado correctamente:", response.data);
    return response.data; // retornas la respuesta al componente que llame esta función
  } catch (error : any) {
    // 🔹 Manejo detallado de error
    if (error.response) {
      console.error(" Error en el servidor:", error.response.data);
      throw new Error(error.response.data.detail || "Error en el servidor al crear Proxmox");
    } else if (error.request) {
      console.error(" Sin respuesta del servidor:", error.request);
      throw new Error("No hubo respuesta del servidor.");
    } else {
      console.error(" Error en la solicitud:", error.message);
      throw new Error("Error en la solicitud al crear Proxmox.");
    }
  }
};

