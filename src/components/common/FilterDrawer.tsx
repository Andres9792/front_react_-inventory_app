import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  InputAdornment,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/FileDownload";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sites: any[];
  selectedSites: any[];
  onSelect: (newSites: any[]) => void;
  onFocusSite: (site: any) => void;
  onFocusDevice: (device: any) => void;
}

export default function FilterDrawer({
  open,
  onClose,
  sites,
  selectedSites,
  onSelect,
  onFocusSite,
  onFocusDevice,
}: FilterDrawerProps) {
  const [search, setSearch] = useState("");
  const [deviceSearch, setDeviceSearch] = useState("");

  // --- Lógica de Exportación KML mejorada con SF200 ---
  const handleExportKML = (site: any) => {
    const inventory = site.inventory || [];
    const format_date = new Date();

    if (inventory.length === 0) {
      alert(`La granja ${site.site_name} no tiene equipos registrados.`);
      return;
    }

    // Estilos visuales para diferenciar en Google Earth
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Inventario - ${site.site_name}</name>
    <Style id="sf200Style">
      <IconStyle><scale>1.2</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-stars.png</href></Icon></IconStyle>
    </Style>
    <Style id="deviceStyle">
      <IconStyle><scale>1.0</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/blu-circle.png</href></Icon></IconStyle>
    </Style>`;

    const kmlFooter = `\n  </Document>\n</kml>`;

    // 1. Obtener SF200 únicos (basado en la IP del controlador central)
    const uniqueSF200s = new Map();
    inventory.forEach((item: any) => {
      if (item.sf200_ip && item.sf200_latitude && item.sf200_longitude) {
        uniqueSF200s.set(item.sf200_ip, {
          ip: item.sf200_ip,
          lat: item.sf200_latitude,
          lng: item.sf200_longitude
        });
      }
    });

    // 2. Generar Placemarks para los SF200
    const sf200Placemarks = Array.from(uniqueSF200s.values()).map(sf => `
    <Placemark>
      <name>CENTRAL SF200: ${sf.ip}</name>
      <styleUrl>#sf200Style</styleUrl>
      <Point><coordinates>${sf.lng},${sf.lat},0</coordinates></Point>
    </Placemark>`).join("");

    // 3. Generar Placemarks para Hidrófonos y Alimentadores
    const devicePlacemarks = inventory
      .filter((d: any) => d.latitude && d.longitude)
      .map((d: any) => `
    <Placemark>
      <name>${d.device_name} (${d.model})</name>
      <description>IP Central: ${d.sf200_ip} | Tipo: ${d.device_type}</description>
      <styleUrl>#deviceStyle</styleUrl>
      <Point>
        <coordinates>${d.longitude},${d.latitude},0</coordinates>
      </Point>
    </Placemark>`).join("");

    const blob = new Blob([kmlHeader + sf200Placemarks + devicePlacemarks + kmlFooter], {
      type: 'application/vnd.google-earth.kml+xml'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AQ1_${site.site_name.replace(/\s+/g, '_')}_${format_date}.kml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredSites = sites.filter((site) =>
    `${site.company_name || ""} ${site.site_name || ""} ${site.analytics_ip || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const groupedSites = filteredSites.reduce((acc: any, site: any) => {
    const company = site.company_name || "Sin empresa";
    if (!acc[company]) acc[company] = [];
    acc[company].push(site);
    return acc;
  }, {});

  const toggleSite = (site: any) => {
    const exists = selectedSites.some((s) => s.id === site.id);
    if (exists) {
      onSelect(selectedSites.filter((s) => s.id !== site.id));
    } else {
      onSelect([...selectedSites, site]);
    }
  };

  const getFilteredInventory = (inventory: any[]) => {
    if (!deviceSearch) return inventory;
    return inventory?.filter((item: any) =>
      `${item.device_name} ${item.model}`
        .toLowerCase()
        .includes(deviceSearch.toLowerCase())
    );
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 330, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Filtros de Granja</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          size="small"
          label="Buscar granja o sitio"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearch(""); onSelect([]); }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
          {Object.entries(groupedSites).map(([company, companySites]: any) => (
            <Box key={company} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: companySites[0]?.color || "#999" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#64748b" }}>
                  {company}
                </Typography>
              </Box>

              {companySites.map((site: any) => {
                const checked = selectedSites.some((s) => s.id === site.id);

                return (
                  <Box key={site.id} sx={{ mb: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          size="small"
                          checked={checked}
                          onChange={() => {
                            toggleSite(site);
                            if (!checked) onFocusSite(site);
                          }}
                        />
                        <Box sx={{ cursor: 'pointer' }} onClick={() => onFocusSite(site)}>
                          <Typography variant="body2" sx={{ fontWeight: checked ? 700 : 400 }}>
                            {site.site_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {site.analytics_ip}
                          </Typography>
                        </Box>
                      </Box>

                      {checked && (
                        <IconButton
                          size="small"
                          onClick={() => handleExportKML(site)}
                          sx={{ color: '#10b981', '&:hover': { bgcolor: '#ecfdf5' } }}
                          title="Descargar KML (Incluye SF200)"
                        >
                          <DownloadIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    </Box>

                    <Collapse in={checked} timeout="auto" unmountOnExit>
                      <Box sx={{ ml: 4, mt: 1, mb: 2, borderLeft: '2px solid #e2e8f0', pl: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={`Buscar en ${site.site_name}...`}
                          variant="standard"
                          value={deviceSearch}
                          onChange={(e) => setDeviceSearch(e.target.value)}
                          InputProps={{
                            startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 1, color: '#94a3b8' }} />
                          }}
                        />

                        <List dense sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
                          {getFilteredInventory(site.inventory || []).map((item: any) => (
                            <ListItem
                              key={item.id}
                              sx={{ p: 0.5, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: '#f1f5f9' } }}
                              onClick={() => onFocusDevice(item)}
                            >
                              <ListItemText
                                primary={item.device_name}
                                secondary={`${item.device_type} - ${item.model}`}
                                primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: 600 }}
                                secondaryTypographyProps={{ fontSize: '0.65rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}