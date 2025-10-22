import  { useState, useEffect } from "react";
import { getsf200Response } from "../api/feederApi";
import type { SF200Response } from "../models/feeders";

export function useFeeders(ips: string[]) {
  const [data, setData] = useState<SF200Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fetchFeeders = async () => {
    try {
      const data = await getsf200Response(ips);
    
      setData(data);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ips.length) return;

    fetchFeeders();
  }, [ips]);

  return {data, loading,error};
}
