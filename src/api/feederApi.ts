import axios from "axios";
import { config } from "../config/config";
import type { SF200Response } from "../models/feeders";

export const getsf200Response = async (
  ips: string[]
): Promise<SF200Response[]> => {
  try {
    const response = await axios.post(
      `${config.API_URL_BASE}/sites/read/`,
      { ips },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 150000,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("erros", error.message);

    return [];
  }
};
