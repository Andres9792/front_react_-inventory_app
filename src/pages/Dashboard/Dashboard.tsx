import { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Tooltip as MuiTooltip,
  IconButton,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useDashboard } from "../../hooks/useDashboatd";

export default function Dashboard() {
  const { data, loading, error, refresh } = useDashboard();

  const totalSites = data?.totals?.total_sites ?? 0;
  const total_feeders = data?.totals?.total_feeders ?? 0;
  const total_wire_feeders = data?.totals?.total_wire_feeders ?? 0;
  const total_sf200 = data?.totals?.total_sf200 ?? 0;

  const sitesByCountry = data?.charts?.sites_by_country ?? [];
  const sitesByVersion = data?.charts?.sites_by_version ?? [];
  const feedersByRegion = data?.charts?.feeders_by_region ?? [];

  const topCompaniesEcuador = data?.tables?.top_companies_ecuador ?? [];

  const pieColors = ["#1976d2", "#9c27b0", "#2e7d32", "#ed6c02", "#d32f2f"];

  // ✅ Fuerza recalcular tamaños cuando termina de cargar o cambian datos (sidebar/layout suele medir tarde)
  useEffect(() => {
    const t = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(t);
  }, [
    loading,
    feedersByRegion.length,
    sitesByVersion.length,
    sitesByCountry.length,
  ]);

  return (
    <Box sx={{ p: 3, width: "100%", bgcolor: "#f5f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Dashboard</Typography>

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          onClick={refresh}
          disabled={loading}
        >
          Refrescar
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Paper sx={{ p: 2, mb: 2, borderLeft: "4px solid #d32f2f" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* KPIs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2">
            Total General de Servidores Analytics
          </Typography>
          <Typography variant="h4">{totalSites}</Typography>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2">
            Cantidad Total de Controladores (SF200)
          </Typography>
          <Typography variant="h4">{total_sf200}</Typography>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2">
            Cantidad Total de Alimentadores (SD100)
          </Typography>
          <Typography variant="h4">{total_feeders}</Typography>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2">
            Cantidad de Alimentadores Alámbricos
          </Typography>
          <Typography variant="h4">{total_wire_feeders}</Typography>
        </Paper>
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Feeders por Región */}
        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="h6">
              Distribución Regional de Alimentadores (SD100)
            </Typography>

            <MuiTooltip
              title="Suma total de feeders instalados agrupados por región: Ecuador, México y Centroamérica (otros países)."
              arrow
            >
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>

          <Box sx={{ width: "100%", height: 300, minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer
              key={feedersByRegion.length}
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <BarChart data={feedersByRegion}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Sites por Versión */}
        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="h6">
              Distribución de Analytics por Versión
            </Typography>

            <MuiTooltip
              title="Cantidad de sites agrupados por versión del sistema (ej: 3.3.12, 3.3.15, etc.)."
              arrow
            >
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>

          <Box sx={{ width: "100%", height: 300, minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer
              key={sitesByVersion.length}
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <PieChart>
                <Pie
                  data={sitesByVersion as any}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {sitesByVersion.map((_: any, i: number) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Sites por País */}
        <Paper sx={{ p: 2, minWidth: 0, gridColumn: { lg: "1 / -1" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="h6">
              Cantidad de Servidores Analytics por País
            </Typography>

            <MuiTooltip
              title="Número total de sites registrados por país."
              arrow
            >
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>

          <Box sx={{ width: "100%", height: 300, minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer
              key={sitesByCountry.length}
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <BarChart data={sitesByCountry}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* Tabla */}
      <Paper sx={{ p: 2, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h6">
            Top Empresas (Ecuador) por Número de Controladores (SF200)
          </Typography>

          <MuiTooltip
            title="Ranking de empresas en Ecuador según la suma total de feeders de sus dispositivos."
            arrow
          >
            <IconButton size="small">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </MuiTooltip>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Empresa</b>
                </TableCell>
                <TableCell align="right">
                  <b>Total Zonas</b>
                </TableCell>
                <TableCell align="right">
                  <b>Total Controladores (SF200)</b>
                </TableCell>

                <TableCell align="right">
                  <b>Total Alimentadores (SD100)</b>
                </TableCell>
                <TableCell align="right">
                  <b>Total Enviros</b>
                </TableCell>
                <TableCell align="right">
                  <b>Total Alimentadores Alámbricos</b>
                </TableCell>
               
              </TableRow>
            </TableHead>

            <TableBody>
              {[...topCompaniesEcuador]
                .sort((a: any, b: any) => b.total_sf200 - a.total_sf200)
                .map((row: any) => (
                  <TableRow key={row.company_name}>
                    <TableCell>{row.company_name}</TableCell>
                    <TableCell align="right">{row.total_zones}</TableCell>
                    <TableCell align="right">{row.total_sf200}</TableCell>
                    <TableCell align="right">{row.total_feeders}</TableCell>
                    <TableCell align="right">{row.total_enviro}</TableCell>
                    <TableCell align="right">
                      {row.total_wire_feeders}
                    </TableCell>
                   
                  </TableRow>
                ))}

              {!topCompaniesEcuador.length && (
                <TableRow>
                  <TableCell colSpan={6}>No hay datos</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
