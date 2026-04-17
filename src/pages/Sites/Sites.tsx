import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useSites } from "../../hooks/useSites";
import "../../mui-data-grid-fix.css";

export default function Sites() {
  const { sites, loading, syncing, error, sync } = useSites();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "analytics_ip", headerName: "Analytics IP", flex: 1 },
    { field: "company_name", headerName: "Empresa", flex: 1 },
    { field: "site_name", headerName: "Sitio", flex: 1 },
    { field: "version", headerName: "Versión", flex: 1 },
    { field: "proxmox_ip", headerName: "Proxmox IP", flex: 1 },
    { field: "country", headerName: "País", flex: 1 },
    { field: "rml_licence", headerName: "Licencia RML", flex: 1 },
    { field: "licence_stat", headerName: "Estado Licencia", flex: 1 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
        width: "100%",
        bgcolor: "#f5f6f8",
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
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          p: 2,
          mb: 4,
        }}
      >
        {/* 🔹 HEADER con botón de sincronización */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6">Lista de Sitios Customer List</Typography>

          <Tooltip title="Sincronizar desde Confluence">
            <span>
              <IconButton onClick={sync} disabled={syncing}>
                {syncing ? <CircularProgress size={22} /> : <RefreshIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* 🔹 Error visible */}
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <DataGrid
            rows={sites}
            columns={columns}
            loading={loading}
            pageSizeOptions={[15, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            disableRowSelectionOnClick
            checkboxSelection
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              border: "none",
              backgroundColor: "white",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1976d2",
                color: "#080202ff",
                fontWeight: "bold",
                fontSize: "0.95rem",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
