import type { SiteData } from "./siteModels";

export interface Proxmox {
  id: number;
  site_data:  SiteData | null; // Puede ser null si no se encuentra el sitio
  analytics_ip: string;
  proxmox: string;
  cpu: string;
  ram: string;
  storage: string;
  storage_model: string;
  backup: string;
  disco_aq1: string;
}