import React, { useState, useMemo } from 'react';
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import type { SiteAudit } from '../../models/siteModels';
import { useDashboard } from '../../hooks/useDashboatd';
import * as XLSX from 'xlsx';
export const SiteDevicesTable: React.FC = () => {
    const { data: metrics, loading } = useDashboard();
    const [searchTerm, setSearchTerm] = useState("");

    const groupedData = useMemo(() => {
        const auditData: SiteAudit[] = metrics?.tables?.sites_audit || [];
        const filtered = auditData.filter(site =>
            site.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.company?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.reduce((acc, current) => {
            const compName = current.company || "A";
            if (!acc[compName]) acc[compName] = [];
            acc[compName].push(current);
            return acc;
        }, {} as Record<string, SiteAudit[]>);
    }, [metrics, searchTerm]);

    if (loading) return <Box sx={{ p: 10, textAlign: 'center' }}>Cargando ...</Box>;
    const exportToExcel = () => {
        // Aplanamos la data agrupada para que sea legible en Excel
        const flatData = metrics?.tables?.sites_audit.map(site => ({
            Empresa: site.company || "A",
            Sitio: site.site_name,
            DNS: `${site.site_name?.toLowerCase().replace(/\s+/g, '-')}.aq1.ec`,
            SF200: site.sf200,
            SM1_Hydro: site.sm1,
            Feeders: site.feeders,
            Estado: site.status?.toUpperCase() || "SIN BASE"
        })) || [];

        // Crear la hoja de trabajo (Worksheet)
        const worksheet = XLSX.utils.json_to_sheet(flatData);

        // Crear el libro (Workbook)
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Auditoría Dispositivos");

        // Descargar el archivo
        XLSX.writeFile(workbook, `Auditoria_AQ1_Ecuador_${new Date().toLocaleDateString()}.xlsx`);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>

            {/* 🔹 Header Estilizado (Igual a Proxmox) */}
            <Box sx={{
                mb: 4, p: 3, display: "flex", alignItems: "center", justifyContent: "space-between",
                bgcolor: "white", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
            }}>
                <Stack spacing={0.5}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: "-0.025em" }}>
                        Equipos  AQ1
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        • Ecuador
                    </Typography>
                    
                    <Button
                        variant="outlined"
                        onClick={exportToExcel}
                        sx={{
                            borderColor: "#107c10", // Color verde tipo Excel
                            color: "#107c10",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            px: 3,
                            "&:hover": {
                                bgcolor: "#f0fdf4",
                                borderColor: "#107c10",
                            },
                        }}
                    >
                        📊 Descargar Excel
                    </Button>
                </Stack>

                <Box sx={{ width: "40%" }}>
                    <TextField
                        fullWidth
                        placeholder="Buscar por cliente o..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: "#94a3b8", mr: 1, fontSize: 20 }} />,
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px", bgcolor: "#f1f5f9", "& fieldset": { border: "none" },
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* 🔹 Tabla con Estilo Moderno */}
            <Box sx={{
                bgcolor: "white", borderRadius: "32px", overflow: "hidden", border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                            <th style={headerCellStyle}>Localización / DNS</th>
                            <th style={headerCellStyle}>SF200</th>
                            <th style={headerCellStyle}>SM1 (Hydro)</th>
                            <th style={headerCellStyle}>Feeders</th>
                            <th style={{ ...headerCellStyle, textAlign: "right" }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedData).map(([company, sites]) => (
                            <React.Fragment key={company}>
                                {/* Separador de Empresa */}
                                <tr style={{ backgroundColor: "#f1f5f9" }}>
                                    <td colSpan={5} style={{ padding: "12px 24px" }}>
                                        <Typography sx={{ fontWeight: 900, fontSize: "13px", color: "#1e293b", textTransform: "uppercase" }}>
                                            🏢 {company}
                                        </Typography>
                                    </td>
                                </tr>

                                {/* Filas de Sitios */}
                                {sites.map((site, idx) => (
                                    <tr key={idx} className="site-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "16px 24px" }}>
                                            <Stack>
                                                <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#334155" }}>
                                                    {site.site_name} Sitio
                                                </Typography>
                                                <Typography sx={{ fontSize: "11px", color: "#3b82f6", fontFamily: "monospace", mt: 0.5 }}>
                                                    {site.site_name?.toLowerCase().replace(/\s+/g, '-')}.aq1.ec
                                                </Typography>
                                            </Stack>
                                        </td>

                                        <td style={dataCellStyle}>
                                            <Typography sx={numberStyle}>{site.sf200}</Typography>
                                        </td>

                                        <td style={dataCellStyle}>
                                            <Typography sx={numberStyle}>{site.sm1}</Typography>
                                        </td>

                                        <td style={dataCellStyle}>
                                            <Typography sx={numberStyle}>{site.feeders}</Typography>
                                        </td>

                                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                            <Box sx={{
                                                display: "inline-block", px: 2, py: 0.5, borderRadius: "20px", fontSize: "10px", fontWeight: 900,
                                                bgcolor: site.status === "Operativos" ? "#f0fdf4" : "#fff1f2",
                                                color: site.status === "Operativos" ? "#16a34a" : "#e11d48",
                                                border: `1px solid ${site.status === "Operativos" ? "#dcfce7" : "#ffe4e6"}`
                                            }}>
                                                {site.status?.toUpperCase() || "SIN BASE"}
                                            </Box>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

// Estilos Reutilizables
const headerCellStyle: React.CSSProperties = {
    padding: "16px 24px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 800,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const dataCellStyle: React.CSSProperties = {
    padding: "16px 24px",
    textAlign: "center",
};

const numberStyle = {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: "14px",
    color: "#475569",
    bgcolor: "#f1f5f9",
    display: "inline-block",
    px: 1.5,
    py: 0.5,
    borderRadius: "8px",
    minWidth: "30px"
};