import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import useProxmox from "../../hooks/useProxmox";
import EditProxmox from "./EditProxmox";
import CreateProxmox from "./CreateProxmox";

const { Column, HeaderCell, Cell } = Table;

export default function Proxmox() {
  const { data, loading, error, refetch } = useProxmox();
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  // 🔹 Construir estructura jerárquica
  const treeData = useMemo(() => {
    if (!data?.length) return [];
    const companies: Record<string, any> = {};

    data.forEach((item) => {
      const company = item.site_data?.company_name || "Sin Empresa";
      const site = item.site_data?.site_name || "Sin Sitio";

      if (!companies[company]) {
        companies[company] = {
          id: `company-${company}`,
          name: company,
          country: item.site_data?.country || "—",
          children: [],
        };
      }

      const siteNode = {
        id: `site-${site}`,
        name: site,
        version: item.site_data?.version || "—",
        analytics_ip: item.site_data?.analytics_ip || "—",
        children: [
          {
            id: `${item.id}`,
            serverId: item.id,
            name: item.proxmox || "—",
            cpu: item.cpu || "—",
            ram: item.ram || "—",
            storage: item.storage || "—",
            backup: item.backup || "No",
            storage_model: item.storage_model || "No",
            disco_aq1: item.disco_aq1 || "No",
          },
        ],
      };

      companies[company].children.push(siteNode);
    });

    return Object.values(companies);
  }, [data]);

  // 🔹 Filtro de búsqueda
const filteredData = useMemo(() => {
  if (!search.trim()) return treeData;
  const lower = search.toLowerCase();

  // Recorre empresa → sitio → servidor
  return treeData
    .map((company: any) => {
      // Si el nombre de la empresa coincide, mostramos todo el grupo completo
      if (company.name.toLowerCase().includes(lower)) {
        return company;
      }

      // Si no coincide la empresa, filtramos sus sitios
      const filteredSites = company.children
        .map((site: any) => {
          // Si el nombre del sitio coincide, mostramos todo el sitio completo (con todos sus servidores)
          if (site.name.toLowerCase().includes(lower)) {
            return site;
          }

          // Si no coincide el sitio, filtramos sus servidores
          const filteredServers = site.children.filter((srv: any) => {
            return (
              srv.name.toLowerCase().includes(lower) ||
              srv.cpu.toLowerCase().includes(lower) ||
              srv.ram.toLowerCase().includes(lower) ||
              srv.storage.toLowerCase().includes(lower) ||
              srv.storage_model.toLowerCase().includes(lower) ||
              srv.backup.toLowerCase().includes(lower)
            );
          });

          if (filteredServers.length > 0) {
            return { ...site, children: filteredServers };
          }

          return null;
        })
        .filter(Boolean);

      if (filteredSites.length > 0) {
        return { ...company, children: filteredSites };
      }

      return null;
    })
    .filter(Boolean);
}, [search, treeData]);


  // 🔹 Manejadores
  const handleEdit = (row: any) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const getParentChain = (row: any) => {
      const chain = [];
      let current = row;

      while (current) {
        const symbols = Object.getOwnPropertySymbols(current);
        const parentSymbol = symbols.find((sym) =>
          sym.toString().includes("parent")
        );
        if (!parentSymbol) break;
        const parent = current[parentSymbol];
        if (!parent) break;
        chain.push(parent);
        current = parent;
      }

      return chain;
    };

    const parents = getParentChain(row);
    const site = parents[0];
    const company = parents[1];

    const extendedRow = {
      ...row,
      site_data: {
        site_name: site?.name || "",
        analytics_ip: site?.analytics_ip || "",
        version: site?.version || "",
        company_name: company?.name || "",
        country: company?.country || "",
      },
    };

    setSelectedRow(extendedRow);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedRow(null);
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando servidores...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#f5f6f8",
        minHeight: "100vh",
      }}
    >
      {/* 🔹 Header con título y botón */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: "white",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🌐 Estructura Proxmox — Empresa → Sitio → Servidor
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 2,
            px: 2.5,
            py: 1,
            boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
          }}
        >
          Nuevo Servidor
        </Button>
      </Stack>

      {/* 🔹 Barra de búsqueda */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <TextField
          placeholder="Buscar..."
          variant="outlined"
          size="small"
          sx={{
            width: "50%",
            backgroundColor: "#fff",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#d0d7de" },
              "&:hover fieldset": { borderColor: "primary.main" },
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* 🔹 Tabla principal */}
      <Table
        isTree
        defaultExpandAllRows
        rowKey="id"
        height={900}
        data={filteredData}
        bordered
        cellBordered
        virtualized
        style={{ width: "100%", background: "#fff", borderRadius: 8 }}
      >
        <Column flexGrow={1}>
          <HeaderCell>Nombre</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>IP / País / CPU</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData.country) return `🌎 ${rowData.country}`;
              if (rowData.analytics_ip)
                return `🔹 Analytics: ${rowData.analytics_ip}`;
              if (rowData.cpu) return `💻 ${rowData.cpu}`;
              return "—";
            }}
          </Cell>
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>RAM / Almacenamiento</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.ram ? `${rowData.ram} / ${rowData.storage}` : "—"
            }
          </Cell>
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Storage AQ1</HeaderCell>
          <Cell>{(rowData) => rowData.storage_model || "—"}</Cell>
        </Column>

        <Column flexGrow={0.3}>
          <HeaderCell>Disco AQ1</HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                style={{
                  color: rowData.disco_aq1 === "Si" ? "green" : "gray",
                  fontWeight: rowData.disco_aq1 === "Si" ? "bold" : "normal",
                }}
              >
                {rowData.disco_aq1 || "—"}
              </span>
            )}
          </Cell>
        </Column>

        <Column flexGrow={0.3}>
          <HeaderCell>Backup</HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                style={{
                  color: rowData.backup === "Si" ? "green" : "gray",
                  fontWeight: rowData.backup === "Si" ? "bold" : "normal",
                }}
              >
                {rowData.backup || "—"}
              </span>
            )}
          </Cell>
        </Column>

        <Column flexGrow={0.3} align="center">
          <HeaderCell>Acción</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.cpu ? (
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(rowData)}
                >
                  <ModeEditIcon />
                </IconButton>
              ) : null
            }
          </Cell>
        </Column>
      </Table>

      {/* 🔹 Diálogos */}
      <EditProxmox
        open={openEdit}
        onClose={handleCloseEdit}
        rowData={selectedRow}
        onUpdated={() => refetch()}
      />

      <CreateProxmox
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => refetch()}
      />
    </Box>
  );
}
