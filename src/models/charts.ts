// src/models/charts.ts

export interface Totals {
  total_sites: number;
  total_devices: number;
  sites_with_devices: number;
  percent_with_devices: number;
  total_feeders: number;
  total_wire_feeders: number;
  total_sf200: number;
}

export interface ChartItem {
  name: string;
  value: number;
}

export interface Company {
  company_name: string;
  total_feeders: number;
  sites: number;
  devices: number;
  total_zones: number;
  total_sf200: number;
  total_enviro: number;
  total_wire_feeders: number;
}

// Interfaz para la tabla de auditoría que definimos antes
export interface SiteAudit {
  site_name: string;
  company: string;
  sf200: number;
  sm1: number;
  feeders: number;
  status: "Operativos" | "Sin Base";
}

export interface DashboardData {
  totals: Totals;
  charts: {
    sites_by_country: ChartItem[];
    sites_by_version: ChartItem[];
    feeders_by_region: ChartItem[];
  };
  tables: {
    top_companies_ecuador: Company[];
    sites_audit: SiteAudit[]; // 👈 AGREGAMOS ESTA LÍNEA
  };
}