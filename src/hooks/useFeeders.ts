import { useCallback, useEffect, useState } from "react";
import { getsf200Responses } from "../api/feederApi";
import type { SF200Response } from "../models/feeders";

export function useFeeders(ips: string[]) {
  const [data, setData] = useState<SF200Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeders = useCallback(async () => {
    if (!ips.length) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getsf200Responses(ips);
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [ips]);

  useEffect(() => {
    fetchFeeders();
  }, [fetchFeeders]);

  return { data, loading, error, refresh: fetchFeeders };
}
