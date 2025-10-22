import { useState, useEffect, useCallback } from "react";
import type { Proxmox } from "../models/proxmox";
import { getProxmoxSites, updateProxmoxApi,createProxmox } from "../api/promoxApi";

export default function useProxmox() {
  const [data, setData] = useState<Proxmox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fecthProxmox = useCallback(async () => {
    try {
      const data = await getProxmoxSites();

      setData(data);
    } catch (error: any) {
      setError(error?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOne = useCallback(async (id: number, payload: any) => {
    try {
      const response = await updateProxmoxApi(id, payload);

      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...response } : item))
      );

      return response;
    } catch (error) {
      console.log("Error actulizar ", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fecthProxmox();
  }, []);


  const createOne = useCallback(async (payload: any) => {
    try {
      const response = await createProxmox(payload);
      setData((prev) => [...prev, response]); // ✅ ahora setData sí existe aquí
      return response;
    } catch (error) {
      console.error("Error al crear Proxmox:", error);
      throw error;
    }
  }, []);





  return { data, loading, error, refetch: fecthProxmox ,updateOne,createOne};
}

