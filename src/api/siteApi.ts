import axios from "axios";
import { config } from "../config/config";
import type { Site, SiteFull } from "../models/siteModels";

export const getSites = async (): Promise<Site[]> => {
  try {
    const response = await axios.get(`${config.API_URL_BASE}/sites`);
  
    return response.data;
  } catch (error: any) {
   
    return [];
  }
};

export const getFullSites = async (): Promise<SiteFull[]> =>{
  try {
    const response = await axios.get(`${config.API_URL_BASE}/sites/full/`);
  
    return response.data;
    
  } catch (error) {
    return []
  }
}
