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
import { useState, Fragment, useRef } from "react";
import { useSites } from "../../hooks/useSites";
import FilterDrawer from "../../components/common/FilterDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";

const { BaseLayer } = LayersControl;

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
    iconUrl: "/assets/icons/icon_shrimp.svg",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  }),
};

const calculateDistance = (
  lat1: string,
  lon1: string,
  lat2: string,
  lon2: string
) => {
  const p1 = parseFloat(lat1);
  const l1 = parseFloat(lon1);
  const p2 = parseFloat(lat2);
  const l2 = parseFloat(lon2);

  if (isNaN(p1) || isNaN(l1) || isNaN(p2) || isNaN(l2)) return "N/A";

  const R = 6371e3;
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

const isValidCoordinate = (lat: any, lng: any) => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  return (
    !isNaN(parsedLat) &&
    !isNaN(parsedLng) &&
    parsedLat !== 0 &&
    parsedLng !== 0
  );
};

export default function Ubicacion() {
  const { fullSites, loading, error } = useSites();
  const [open, setOpen] = useState(false);
  const [selectedSites, setSelectedSites] = useState<any[]>([]);
  const mapRef = useRef<any>(null);

  const visibleSites = selectedSites.length ? selectedSites : fullSites;

  const handleFocusSite = (site: any) => {
    if (!mapRef.current) return;

    const device = site.devices?.find((d: any) => d.latitude && d.longitude);

    if (device) {
      mapRef.current.flyTo(
        [parseFloat(device.latitude), parseFloat(device.longitude)],
        16
      );
      return;
    }

    const inventoryItem = site.inventory?.find(
      (item: any) => item.latitude && item.longitude
    );

    if (inventoryItem) {
      mapRef.current.flyTo(
        [parseFloat(inventoryItem.latitude), parseFloat(inventoryItem.longitude)],
        16
      );
    }
  };

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
        width: "100%",
        bgcolor: "#f5f6f8",
        minHeight: "100vh",
        pb: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "95%",
          borderRadius: 3,
          p: 3,
          bgcolor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e9ecef",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
        >
          Ubicación de Grupos y Dispositivos
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              border: "1px solid #d0d7de",
              borderRadius: 2,
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            <FilterListIcon />
          </IconButton>

          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Filtrar sitios
          </Typography>
        </Box>

        <FilterDrawer
          open={open}
          onClose={() => setOpen(false)}
          sites={fullSites}
          selectedSites={selectedSites}
          onSelect={setSelectedSites}
          onFocusSite={handleFocusSite}
        />

        <Box
          sx={{
            height: "80vh",
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <MapContainer
            center={[-2.2706, -79.7382]}
            zoom={15}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
            maxZoom={20}
            ref={mapRef}
          >
            <ZoomControl position="topright" />

            <LayersControl position="topright">
              <BaseLayer checked name="Claro">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              </BaseLayer>

              <BaseLayer name="Mapa Oscuro">
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              </BaseLayer>

              <BaseLayer name="Satélite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxNativeZoom={18}
                  maxZoom={22}
                />
              </BaseLayer>
            </LayersControl>

            {visibleSites.map((site: any) =>
              site.devices
                ?.filter((device: any) => isValidCoordinate(device.latitude , device.longitude))
                .map((device: any) => (
                  <Marker
                    key={`shrimp-${site.id}-${device.id}`}
                    position={[
                      parseFloat(device.latitude),
                      parseFloat(device.longitude),
                    ]}
                    icon={createShrimpIcon(site.color || "#DB705C")}
                  >
                    <Popup>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {site.company_name}
                      </Typography>
                      <Typography variant="body2">
                        Sitio: {site.site_name}
                      </Typography>
                      <Typography variant="caption">
                        ID Dispositivo: {device.id}
                      </Typography>
                    </Popup>
                  </Marker>
                ))
            )}

            {visibleSites.map((site: any) => {
              const renderedSF200s = new Set();

              return site.inventory
                ?.filter((item: any) =>
                  isValidCoordinate(item.latitude, item.longitude) &&
                  isValidCoordinate(item.sf200_latitude, item.sf200_longitude)
                )
                .map((item: any) => {
                  const deviceCoords: [number, number] = [
                    parseFloat(item.latitude),
                    parseFloat(item.longitude),
                  ];

                  const sf200Coords: [number, number] = [
                    parseFloat(item.sf200_latitude),
                    parseFloat(item.sf200_longitude),
                  ];

                  const isSameLocation =
                    deviceCoords[0] === sf200Coords[0] &&
                    deviceCoords[1] === sf200Coords[1];

                  const isHydrophone = item.device_type === "Hydrophone";

                  const shouldRenderSF200 =
                    item.sf200_ip && !renderedSF200s.has(item.sf200_ip);

                  if (shouldRenderSF200) renderedSF200s.add(item.sf200_ip);

                  const dist = calculateDistance(
                    item.latitude,
                    item.longitude,
                    item.sf200_latitude,
                    item.sf200_longitude
                  );

                  return (
                    <Fragment key={`inv-group-${item.id}`}>
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

                      {shouldRenderSF200 && (
                        <Marker position={sf200Coords} icon={icons.sf200}>
                          <Popup>
                            <Box sx={{ minWidth: 200 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700 }}
                              >
                                SF200 Central
                              </Typography>
                              <Typography variant="body2">
                                IP: {item.sf200_ip}
                              </Typography>
                            </Box>
                          </Popup>
                        </Marker>
                      )}

                      <Marker position={deviceCoords} icon={getIconForType(item)}>
                        <Popup>
                          <Box sx={{ minWidth: 240 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, mb: 1 }}
                            >
                              {item.device_name || "Dispositivo"}
                            </Typography>

                            <Divider sx={{ mb: 1 }} />

                            <Typography variant="body2">
                              <strong>Tipo:</strong> {item.device_type}
                            </Typography>

                            <Typography variant="body2">
                              <strong>Modelo:</strong> {item.model}
                            </Typography>

                            <Typography variant="body2">
                              <strong>Serial:</strong> {item.serial}
                            </Typography>

                            <Typography variant="body2">
                              <strong>Firmware:</strong> {item.firmware}
                            </Typography>

                            <Typography variant="body2">
                              <strong>Zona:</strong> {item.zone}
                            </Typography>

                            <Typography variant="body2">
                              <strong>SF200 IP:</strong> {item.sf200_ip}
                            </Typography>

                            <Typography variant="body2">
                              <strong>Distancia al SF200:</strong> {dist}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{ mt: 1, display: "block" }}
                            >
                              Lat: {item.latitude} | Lng: {item.longitude}
                            </Typography>
                          </Box>
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