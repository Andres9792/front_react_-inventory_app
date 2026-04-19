import { useState, useEffect, useCallback } from "react";
import type { Site, SiteFull } from "../models/siteModels";
import {
  getFullSites,
  getSites,
  refreshSites, // 👈 IMPORTAMOS EL ENDPOINT
} from "../api/siteApi";

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [fullSites, setFullSites] = useState<SiteFull[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false); // 👈 para el botón
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [sitesData, fullSitesData] = await Promise.all([
        getSites(),
        getFullSites(),
      ]);

      setSites(sitesData);
      setFullSites(fullSitesData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

 
  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);

    try {
      await refreshSites();
      await load();       
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al sincronizar");
    } finally {
      setSyncing(false);
    }
  }, [load]);


  useEffect(() => {
    load();
  }, [load]);


  return {
    sites,
    fullSites,
    loading,
    syncing, 
    error,
    refresh: load, 
    sync,           
  };
}
