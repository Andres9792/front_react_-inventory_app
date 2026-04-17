// src/hooks/useDashboard.ts
import { useCallback, useEffect, useState } from "react";
import type { DashboardData } from "../models/charts";
import { getDashboardMetrics } from "../api/dashboardApi";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDashboardMetrics();
      setData(res); // ✅ CLAVE: guardar data
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
