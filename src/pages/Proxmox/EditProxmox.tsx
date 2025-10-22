import {
  Dialog,
  DialogActions,
  Card,
  CardHeader,
  CardContent,
  Button,
  Stack,
  Typography,
  Divider,
  Box,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import useProxmox from "../../hooks/useProxmox";

type Props = {
  open: boolean;
  onClose: () => void;
  rowData: any;
  onUpdated: () => void;
};

export default function EditProxmox({
  open,
  onClose,
  rowData,
  onUpdated,
}: Props) {
  const { updateOne } = useProxmox();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    cpu: "",
    ram: "",
    storage: "",
    storage_model: "",
    backup: false,
    disco_aq1: false,
  });

  useEffect(() => {
    if (rowData) {
      setFormData({
        id: rowData.serverId || rowData.id || "",
        name: rowData.name || rowData.proxmox || "",
        cpu: rowData.cpu || "",
        ram: rowData.ram || "",
        storage: rowData.storage || "",
        storage_model: rowData.storage_model || "",
        backup: rowData.backup === "Si",
        disco_aq1: rowData.disco_aq1 === "Si",
      });
    }
  }, [rowData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSave = async () => {
    const payload = {
      id: formData.id,
      cpu: formData.cpu,
      ram: formData.ram,
      storage: formData.storage,
      storage_model: formData.storage_model,
      backup: formData.backup ? "Si" : "No",
      disco_aq1: formData.disco_aq1 ? "Si" : "No",
    };
    console.log(" Enviando actualización:", payload);

    try {
      await updateOne(rowData.id, payload);
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
    onClose();
  };

  if (!rowData) return null;

  const site = rowData.site_data || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: "#f9fafc",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      <Card>
        <CardHeader
          title={
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {site.site_name || "Servidor"}
              </Typography>
              <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
                {rowData.proxmox || rowData.name || "Sin IP"}
              </Typography>
            </Box>
          }
          sx={{
            bgcolor: "primary.main",
            py: 2,
          }}
        />

        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">
              Información General
            </Typography>
            <Divider />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="CPU"
                name="cpu"
                value={formData.cpu}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="RAM"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Storage"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Modelo de Storage"
                name="storage_model"
                value={formData.storage_model}
                onChange={handleChange}
              />
            </Stack>

            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.backup}
                    onChange={handleSwitchChange}
                    name="backup"
                    color="primary"
                  />
                }
                label="Backup activo"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.disco_aq1}
                    onChange={handleSwitchChange}
                    name="disco_aq1"
                    color="primary"
                  />
                }
                label="Disco AQ1 presente"
              />
            </Stack>

            <Divider />
            <Typography variant="h6" color="primary">
              Información del Sitio
            </Typography>

            <Box>
              <Typography>
                <strong>Empresa:</strong> {site.company_name || "—"}
              </Typography>
              <Typography>
                <strong>IP Analytics:</strong> {site.analytics_ip || "—"}
              </Typography>
              <Typography>
                <strong>Versión:</strong> {site.version || "—"}
              </Typography>
              <Typography>
                <strong>País:</strong> {site.country || "—"}
              </Typography>
            </Box>

            {/* ID oculto para debugging */}
            {process.env.NODE_ENV === "development" && (
              <Typography variant="caption" color="gray">
                ID Interno: {formData.id}
              </Typography>
            )}
          </Stack>
        </CardContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            startIcon={<CloseIcon />}
            color="error"
            variant="outlined"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
}
