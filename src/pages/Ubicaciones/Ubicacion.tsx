import "leaflet/dist/leaflet.css";
import { Box, Typography } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useSites } from "../../hooks/useSites";

import FilterDrawer from "../../components/common/FilterDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";
import { IconButton } from "@mui/material";

const customIcon = L.icon({
  iconUrl: "/assets/icons/icon_shrimp.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

export default function Ubicacion() {
  const { fullSites, loading, error } = useSites();
  const [open, setOpen] = useState(false);
  const [selectedSites, setSelectedSites] = useState<any[]>([]);

  const limeOptions = { color: "lime", weight: 2 };
  const purpleOptions = { color: "purple", weight: 2, fillOpacity: 0.3 };
  
  if (loading) return <p>Cargando mapa...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
        width: "100%",
        bgcolor: "#f5f6f8", // 🔹 gris muy claro de fondo general
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "95%",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", // 🔹 sombra suave
          p: 2,
          mb: 4, // 🔹 espacio al final
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ubicación de Grupos
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <IconButton onClick={() => setOpen(true)}>
            <FilterListIcon />
          </IconButton>
          <Typography variant="h6">---</Typography>
        </Box>

        <FilterDrawer
          open={open}
          onClose={() => setOpen(false)}
          sites={fullSites}
          selectedSites={selectedSites}
          onSelect={setSelectedSites}
        />
        <div
          style={{
            height: "80vh",
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <MapContainer
            center={[-2.1905717684220334, -79.89546329057636]} // Ecuador  Mall del Sol
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {(selectedSites.length ? selectedSites : fullSites).map((site) =>
              site.devices
                ?.filter(
                  (device: any) =>
                    device.latitude !== null &&
                    device.longitude !== null &&
                    device.latitude !== "" &&
                    device.longitude !== ""
                )
                .map((device: any) => (
                  <Marker
                    key={`${site.id}-${device.id}`}
                    position={[
                      parseFloat(device.latitude),
                      parseFloat(device.longitude),
                    ]}
                    icon={customIcon}
                  >
                    <Popup>
                      <strong>{site.company_name}</strong> <br />
                      País: {site.country} <br />
                      Versión: {site.version} <br />
                      Zonas: {device.zones} <br />
                      SF200: {device.sf200} <br />
                      SD100: {device.feeder} <br />
                    </Popup>
                  </Marker>
                ))
            )}
          </MapContainer>
        </div>

        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
    </Box>
  );
}
