export interface SF200Response {
  ip: string;             
  total_devices: number;  
  devices: SF200Device[]; 
}

export interface SF200Device {
  Name: string;
  Serial: string;
  Model: string;
  Battery_V: number | null;
  FW: string | null;
  Kg_Fed: number | null;
  RSSI: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Last_Heard: string | null;
  Type: string;
}


