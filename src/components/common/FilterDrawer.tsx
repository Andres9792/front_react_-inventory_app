import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sites: any[];
  selectedSites: any[];
  onSelect: (newSites: any[]) => void;
  onFocusSite: (site: any) => void; // 🔥 AGREGA ESTA LÍNEA
}

export default function FilterDrawer({
  open,
  onClose,
  sites,
  selectedSites,
  onSelect,
  onFocusSite,
}: FilterDrawerProps) {
  const [search, setSearch] = useState("");

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

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 330, p: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Filtros de Granja</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/*  INPUT CON X */}
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
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearch("");
                    onSelect([]); // 🔥 esto resetea TODO
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ maxHeight: "75vh", overflowY: "auto" }}>
          {Object.entries(groupedSites).map(([company, companySites]: any) => (
            <Box key={company} sx={{ mb: 2 }}>

              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: companySites[0]?.color || "#999",
                  }}
                />

                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {company}
                </Typography>
              </Box>

              {companySites.map((site: any) => {
                const checked = selectedSites.some((s) => s.id === site.id);

                return (
                  <Box key={site.id} display="flex" alignItems="center">
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => {
                        toggleSite(site);
                        onFocusSite(site);
                      }}
                    />

                    <Box>
                      <Typography variant="body2">
                        {site.site_name}
                      </Typography>
                      <Typography variant="caption">
                        {site.analytics_ip}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}