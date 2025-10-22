import { useState ,useEffect} from "react";
import type { Site, SiteFull } from "../models/siteModels";
import { getFullSites, getSites } from "../api/siteApi";

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [fullSites, setFullSites] = useState<SiteFull[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = async () => {
    
    try {
      const data = await getSites();
      
      setSites(data);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

const fetchSitesFull = async () =>{
  try {
    const fullData =  await getFullSites();
    setFullSites(fullData);
  } catch ( error : any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };


  
  useEffect(() => {
    fetchSitesFull();
  }, []);

  
  
  useEffect(() => {
    fetchSites();
  }, []);

  return { sites, fullSites,loading, error };
}

