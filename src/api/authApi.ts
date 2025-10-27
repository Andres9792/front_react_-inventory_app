import axios from "axios";
import type { LoginRequest, LoginResponse } from "../models/auth";
import { config } from "../config/config";


export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {

    try {

        const { data } = await axios.post(`${config.API_URL_BASE}/login/`, credentials, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        if (!data.access || !data.refresh) {
            throw new Error("Respuesta inválida del servidor");
        }


        return data;
    } catch (error: any) {
        console.log("Login user error", error);

        if (error.response) {
            // Error devuelto por el servidor
            const status = error.response.status;
            if (status === 400 || status === 401) {
                throw new Error("Credenciales incorrectas. Verifica tu usuario o contraseña.");
            } else if (status >= 500) {
                throw new Error("Error del servidor. Intenta nuevamente más tarde.");
            } else {
                throw new Error(`Error desconocido (${status})`);
            }
        } else if (error.request) {
            // No hubo respuesta del servidor
            throw new Error("No se pudo conectar con el servidor. Verifica tu red.");
        } else {
            // Error en la configuración o en el código
            throw new Error("Error interno en la solicitud.");
        }
    }

}




