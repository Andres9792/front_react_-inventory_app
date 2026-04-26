import "leaflet/dist/leaflet.css";
import { Box, Typography, IconButton, Paper, Divider } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  ZoomControl,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { useState, Fragment } from "react";
import { useSites } from "../../hooks/useSites";
import FilterDrawer from "../../components/common/FilterDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";

const { BaseLayer } = LayersControl;

// 1. CONFIGURACIÓN DE ICONOS
const icons = {
  hydrophone: L.icon({
    iconUrl: "/assets/icons/sm1device.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  }),
  sd100: L.icon({
    iconUrl: "/assets/icons/sd100device.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  }),
  sf200: L.icon({
    iconUrl: "/assets/icons/sf200device.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  }),
  default: L.icon({
    iconUrl: "assets/icons/icon_shrimp.svg",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  }),
};

// 2. UTILIDAD: CÁLCULO DE DISTANCIA (Haversine)
const calculateDistance = (lat1: string, lon1: string, lat2: string, lon2: string) => {
  const p1 = parseFloat(lat1), l1 = parseFloat(lon1);
  const p2 = parseFloat(lat2), l2 = parseFloat(lon2);
  if (isNaN(p1) || isNaN(p2)) return "N/A";

  const R = 6371e3; // Radio de la Tierra en metros
  const dLat = ((p2 - p1) * Math.PI) / 180;
  const dLon = ((l2 - l1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1 * Math.PI) / 180) *
    Math.cos((p2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d > 1000 ? `${(d / 1000).toFixed(2)} km` : `${d.toFixed(2)} m`;
};

export default function Ubicacion() {
  const { fullSites, loading, error } = useSites();
  const [open, setOpen] = useState(false);
  const [selectedSites, setSelectedSites] = useState<any[]>([]);

  const visibleSites = selectedSites.length ? selectedSites : fullSites;

  if (loading) return <p>Cargando mapa...</p>;
  if (error) return <p>Error: {error}</p>;

  const getIconForType = (item: any) => {
    if (item.device_type === "Hydrophone") return icons.hydrophone;
    if (item.device_type === "Feeder") return icons.sd100;
    return icons.default;
  };

const createShrimpIcon = (color: string = "#DB705C") => {
  return L.divIcon({
    className: "custom-shrimp-icon",
    html: `
      <svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18 C10 10 20 8 36 12"
              fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>

        <path d="M20 20 
                 C35 20 50 25 50 36
                 C50 47 40 54 30 50
                 C22 47 20 40 26 36"
              fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>

        <path d="M28 28 L24 34" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <path d="M34 28 L30 34" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <path d="M40 30 L36 36" stroke="${color}" stroke-width="4" stroke-linecap="round"/>

        <circle cx="26" cy="26" r="2" fill="${color}"/>

        <path d="M30 50 Q24 56 30 60"
              fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
};
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, width: "100%", bgcolor: "#f5f6f8", minHeight: "100vh", pb: 4 }}>
      <Paper elevation={0} sx={{ width: "95%", borderRadius: 3, p: 3, bgcolor: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e9ecef" }}>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}>
          Ubicación de Grupos y Dispositivos
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconButton onClick={() => setOpen(true)} sx={{ border: "1px solid #d0d7de", borderRadius: 2, bgcolor: "#fff", "&:hover": { bgcolor: "#f8fafc" } }}>
            <FilterListIcon />
          </IconButton>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>Filtrar sitios</Typography>
        </Box>

        <FilterDrawer open={open} onClose={() => setOpen(false)} sites={fullSites} selectedSites={selectedSites} onSelect={setSelectedSites} />

        <Box sx={{ height: "80vh", width: "100%", borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <MapContainer center={[-2.2706, -79.7382]} zoom={15} zoomControl={false} style={{ height: "100%", width: "100%" }} maxZoom={20}>
            <ZoomControl position="topright" />
            {/* Capa Clara (Default) */}
            <LayersControl position="topright">
              <BaseLayer checked name="Claro">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              </BaseLayer>

              {/* CAPA OSCURA (La que faltaba) */}
              <BaseLayer name="Mapa Oscuro">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              </BaseLayer>

              {/* Capa de Satélite */}
              <BaseLayer name="Satélite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxNativeZoom={18} // El límite real de la foto
                  maxZoom={22}       // Hasta dónde te dejo hacer scroll con el mouse
                />
              </BaseLayer>
            </LayersControl>
            {/* BLOQUE DE DISPOSITIVOS GENERALES (Los "Camarones") */}
            {visibleSites.map((site: any) =>
              site.devices
                ?.filter((device: any) => device.latitude && device.longitude)
                .map((device: any) => (
                  <Marker
                    key={`shrimp-${site.id}-${device.id}`}
                    position={[parseFloat(device.latitude), parseFloat(device.longitude)]}
                    icon={createShrimpIcon(site.color || "#DB705C")}
                  >
                    <Popup>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{site.company_name}</Typography>
                      <Typography variant="body2">Sitio: {site.site_name}</Typography>
                      <Typography variant="caption">ID Dispositivo: {device.id}</Typography>
                    </Popup>
                  </Marker>
                ))
            )}

  {visibleSites.map((site: any) => {
  const renderedSF200s = new Set();

  return site.inventory
    ?.filter((item: any) => item.latitude && item.longitude && item.sf200_latitude && item.sf200_longitude) // Filtro inicial de existencia
    .map((item: any) => {
      const deviceCoords: [number, number] = [parseFloat(item.latitude), parseFloat(item.longitude)];
      const sf200Coords: [number, number] = [parseFloat(item.sf200_latitude), parseFloat(item.sf200_longitude)];

      // VALIDACIÓN: Evitar líneas de longitud cero
      // Si la latitud y longitud son idénticas, no dibujamos la línea
      const isSameLocation = 
        deviceCoords[0] === sf200Coords[0] && 
        deviceCoords[1] === sf200Coords[1];

      const isHydrophone = item.device_type === "Hydrophone";
      const shouldRenderSF200 = item.sf200_ip && !renderedSF200s.has(item.sf200_ip);
      if (shouldRenderSF200) renderedSF200s.add(item.sf200_ip);

      const dist = calculateDistance(item.latitude, item.longitude, item.sf200_latitude, item.sf200_longitude);

      return (
        <Fragment key={`inv-group-${item.id}`}>
          {/* 1. LÍNEA DE CONEXIÓN: Solo se dibuja si NO están en el mismo punto */}
          {!isSameLocation && (
            <Polyline
              positions={[sf200Coords, deviceCoords]}
              pathOptions={{
                color: isHydrophone ? "#3498db" : "#e67e22",
                weight: 2,
                dashArray: "5, 10",
                opacity: 0.7,
              }}
            />
          )}

          {/* 2. MARCADOR SF200 */}
          {shouldRenderSF200 && (
            <Marker position={sf200Coords} icon={icons.sf200}>
              <Popup>
                <Typography variant="subtitle2"><strong>SF200 Central</strong></Typography>
                <Typography variant="body2">IP: {item.sf200_ip}</Typography>
              </Popup>
            </Marker>
          )}

          {/* 3. MARCADOR DEL DISPOSITIVO */}
          <Marker position={deviceCoords} icon={getIconForType(item)}>
            {/* ... resto de tu Popup ... */}
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