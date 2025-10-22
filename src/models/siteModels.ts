export interface Site {
  id: number;
  analytics_ip: string;
  company_name: string;
  version: string;
  proxmox_ip: string;
  country: string;
  rml_licence: string;
  licence_stat: string;
}

export interface SiteFull {
  id: number;
  company_name: string;
  country: string;
  version: string;
  latitude: string;
  longitude: string;
  devices: Device[];
}

export interface Device {
  id: number;
  dns: string;
  analytics_ip: string;
  latitude: string;
  longitude: string;
}


export interface SiteData {
  id: number;
  company_name: string;
  site_name: string;
  analytics_ip: string;
  version: string;
  country: string;
}
