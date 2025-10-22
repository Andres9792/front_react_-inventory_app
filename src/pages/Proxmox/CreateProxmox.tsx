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
import { useState } from "react";
import useProxmox from "../../hooks/useProxmox";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // callback para recargar la lista en el padre
};

export default function CreateProxmox({ open, onClose, onCreated }: Props) {
  const { createOne } = useProxmox();

  const [formData, setFormData] = useState({
    analytics_ip: "",
    proxmox: "",
    cpu: "",
    ram: "",
    storage: "",
    storage_model: "",
    backup: false,
    disco_aq1: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSave = async () => {
    const payload = {
      analytics_ip: formData.analytics_ip,
      proxmox: formData.proxmox,
      cpu: formData.cpu,
      ram: formData.ram,
      storage: formData.storage,
      storage_model: formData.storage_model,
      backup: formData.backup ? "Si" : "No",
      disco_aq1: formData.disco_aq1 ? "Si" : "No",
    };

    console.log(" Enviando nuevo registro:", payload);

    try {
      await createOne(payload);
      onCreated(); // refresca la tabla principal
      onClose();
    } catch (error) {
      console.error("Error al crear Proxmox:", error);
    }
  };

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
                Nuevo Servidor Proxmox
              </Typography>
              <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
                Completa los datos del servidor a registrar
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
              Información del Servidor
            </Typography>
            <Divider />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Analytics IP"
                name="analytics_ip"
                value={formData.analytics_ip}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Proxmox IP"
                name="proxmox"
                value={formData.proxmox}
                onChange={handleChange}
              />
            </Stack>

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
            Guardar Servidor
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
}
