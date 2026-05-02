import "leaflet/dist/leaflet.css";
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Divider, 
  Avatar, 
  Stack,
  Chip
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  ZoomControl,
  Polyline,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useState, Fragment, useRef, useMemo } from "react";
import { useSites } from "../../hooks/useSites";
import FilterDrawer from "../../components/common/FilterDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";

const { BaseLayer } = LayersControl;

// --- Configuración de Iconos ---
const icons = {
  hydrophone: L.icon({
    iconUrl: "/assets/icons/sm1device.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  }),
  sd100: L.icon({
    iconUrl: "/assets/icons/sd100device.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  }),
  sf200: L.icon({
    iconUrl: "/assets/icons/sf200device.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -15],
  }),
  default: L.icon({
    iconUrl: "/assets/icons/icon_shrimp.svg",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  }),
};

// --- Utilidades ---
const calculateDistance = (lat1: string, lon1: string, lat2: string, lon2: string) => {
  const p1 = parseFloat(lat1), l1 = parseFloat(lon1);
  const p2 = parseFloat(lat2), l2 = parseFloat(lon2);
  if ([p1, l1, p2, l2].some(isNaN)) return "N/A";

  const R = 6371e3; // Radio de la Tierra en metros
  const dLat = ((p2 - p1) * Math.PI) / 180;
  const dLon = ((l2 - l1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(p1 * Math.PI / 180) * Math.cos(p2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d > 1000 ? `${(d / 1000).toFixed(2)} km` : `${d.toFixed(2)} m`;
};

const isValidCoordinate = (lat: any, lng: any) => {
  const pLat = parseFloat(lat), pLng = parseFloat(lng);
  return !isNaN(pLat) && !isNaN(pLng) && pLat !== 0 && pLng !== 0;
};

const createShrimpIcon = (color: string = "#DB705C") => {
  return L.divIcon({
    className: "custom-shrimp-wrapper",
    html: `
      <svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.3))">
        <path d="M16 18 C10 10 20 8 36 12" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <path d="M20 20 C35 20 50 25 50 36 C50 47 40 54 30 50 C22 47 20 40 26 36" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="26" cy="26" r="2" fill="${color}"/>
        <path d="M30 50 Q24 56 30 60" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
};

export default function Ubicacion() {
  const { fullSites, loading, error } = useSites();
  const [open, setOpen] = useState(false);
  const [selectedSites, setSelectedSites] = useState<any[]>([]);
  const mapRef = useRef<any>(null);

  const visibleSites = useMemo(() => 
    selectedSites.length ? selectedSites : fullSites
  , [selectedSites, fullSites]);

  if (loading) return <Box p={4}><Typography>Cargando mapa de activos...</Typography></Box>;
  if (error) return <Box p={4}><Typography color="error">Error: {error}</Typography></Box>;

  const handleFocusSite = (site: any) => {
    if (!mapRef.current) return;
    const target = site.devices?.find((d: any) => d.latitude && d.longitude) || 
                   site.inventory?.find((i: any) => i.latitude && i.longitude);
    if (target) {
      mapRef.current.flyTo([parseFloat(target.latitude), parseFloat(target.longitude)], 17, { duration: 1.5 });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, width: "100%", bgcolor: "#f8fafc", minHeight: "100vh", pb: 4 }}>
      <Paper elevation={0} sx={{ width: "96%", borderRadius: 4, p: { xs: 2, md: 3 }, bgcolor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", letterSpacing: "-0.5px" }}>
              Localización de Dispostivos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitoreo de dispositivos en tiempo real
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(true)} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Stack>

        <FilterDrawer
          open={open}
          onClose={() => setOpen(false)}
          sites={fullSites}
          selectedSites={selectedSites}
          onSelect={setSelectedSites}
          onFocusSite={handleFocusSite}
        />

        <Box sx={{ height: "75vh", width: "100%", borderRadius: 4, overflow: "hidden", border: "1px solid #e2e8f0", position: 'relative' }}>
          <MapContainer
            center={[-2.2706, -79.7382]}
            zoom={13}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <ZoomControl position="bottomright" />

            <LayersControl position="topright">
              <BaseLayer checked name="Light">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              </BaseLayer>
              <BaseLayer name="Dark">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              </BaseLayer>
              <BaseLayer name="Satélite">
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              </BaseLayer>
            </LayersControl>

            {/* Marcadores de Camarón con Clustering */}
            <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
              {visibleSites.map((site: any) =>
                site.devices
                  ?.filter((d: any) => isValidCoordinate(d.latitude, d.longitude))
                  .map((device: any) => (
                    <Marker
                      key={`shrimp-${device.id}`}
                      position={[parseFloat(device.latitude), parseFloat(device.longitude)]}
                      icon={createShrimpIcon(site.color)}
                    >
                      <Popup>
                        <Box sx={{ p: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{site.site_name}</Typography>
                          <Typography variant="caption" sx={{ color: site.color, fontWeight: 700 }}>{site.company_name}</Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>ID: {device.id}</Typography>
                        </Box>
                      </Popup>
                    </Marker>
                  ))
              )}
            </MarkerClusterGroup>

            {/* Marcadores de Inventario y Polylines */}
            {visibleSites.map((site: any) => {
              const renderedSF200s = new Set();
              return site.inventory
                ?.filter((item: any) => isValidCoordinate(item.latitude, item.longitude))
                .map((item: any) => {
                  const deviceCoords: [number, number] = [parseFloat(item.latitude), parseFloat(item.longitude)];
                  const sf200Coords: [number, number] = [parseFloat(item.sf200_latitude), parseFloat(item.sf200_longitude)];
                  const hasSF200 = isValidCoordinate(item.sf200_latitude, item.sf200_longitude);
                  const isHydrophone = item.device_type === "Hydrophone";

                  return (
                    <Fragment key={`inv-${item.id}`}>
                      {hasSF200 && (
                        <Polyline 
                          positions={[sf200Coords, deviceCoords]} 
                          pathOptions={{ color: isHydrophone ? "#3b82f6" : "#f59e0b", weight: 2, dashArray: "6, 8", opacity: 0.6 }} 
                        />
                      )}

                      {hasSF200 && !renderedSF200s.has(item.sf200_ip) && (
                        renderedSF200s.add(item.sf200_ip) && (
                          <Marker position={sf200Coords} icon={icons.sf200}>
                            <Popup>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>SF200 Central</Typography>
                              <Typography variant="body2">IP: {item.sf200_ip}</Typography>
                            </Popup>
                          </Marker>
                        )
                      )}

                      <Marker 
                        position={deviceCoords} 
                        icon={item.device_type === "Hydrophone" ? icons.hydrophone : icons.sd100}
                      >
                        <Popup>
                          <Box sx={{ minWidth: 220, p: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: site.color, fontSize: 10 }}>
                                {item.device_type?.charAt(0)}
                              </Avatar>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.device_name}</Typography>
                            </Stack>
                            
                            <Divider sx={{ mb: 1 }} />
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                              <Typography variant="caption"><b>Tipo:</b> {item.device_type}</Typography>
                              <Typography variant="caption"><b>Modelo:</b> {item.model}</Typography>
                            </Box>

                            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
                              Distancia: {calculateDistance(item.latitude, item.longitude, item.sf200_latitude, item.sf200_longitude)}
                            </Typography>
                          </Box> {/* Box de cierre que faltaba corregido */}
                        </Popup>
                      </Marker>
                    </Fragment>
                  );
                });
            })}
          </MapContainer>
        </Box>
      </Paper>
    </Box>
  );
}