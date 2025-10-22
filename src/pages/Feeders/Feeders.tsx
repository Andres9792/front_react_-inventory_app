import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useFeeders } from "../../hooks/useFeeders";
import SF200Viewer from "../../components/common/SF200Viewer";

export default function Feeders() {
  const [ipInput, setIpInput] = useState("");
  const [ips, setIps] = useState<string[]>([]);
  const { data, loading, error } = useFeeders(ips);

  const handleAddIp = () => {
    if (!ipInput.trim()) return;
    const newIps = ipInput
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip && !ips.includes(ip));
    setIps([...ips, ...newIps]);
    setIpInput("");
  };

  const handleRemoveIp = (ip: string) => {
    setIps(ips.filter((i) => i !== ip));
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f6f8", minHeight: "100vh" }}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          p: 3,
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔹 Consultar Feeders (varias IPs)
        </Typography>

        {/* --- Entrada de IPs --- */}
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <TextField
            label="Agregar IP"
            fullWidth
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Ej: 172.18.79.26 o varias separadas por coma"
          />
          <Button variant="contained" onClick={handleAddIp}>
            Agregar
          </Button>
        </Box>

        {/* --- Chips de IPs activas --- */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {ips.map((ip) => (
            <Chip key={ip} label={ip} onDelete={() => handleRemoveIp(ip)} />
          ))}
        </Box>

        {/* --- Estado de carga --- */}
        {loading && (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
            <Typography variant="body2" color="textSecondary" mt={1}>
              Consultando dispositivos...
            </Typography>
          </Box>
        )}

        {/* --- Errores --- */}
        {!loading && error && <Typography color="error" mt={2}></Typography>}

        {/* --- Datos (renderizado del viewer) --- */}
{/* --- Datos (renderizado del viewer compacto) --- */}
{!loading && !error && data.map(site => (
  <div key={site.ip} style={{ marginBottom: 16 }}>
    <SF200Viewer data={site} />
  </div>
))}

      </Box>
    </Box>
  );
}
