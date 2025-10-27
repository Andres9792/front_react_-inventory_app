import {
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../api/authApi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const userData = await loginUser({
        username: formData.email,
        password: formData.password,
      });

      if (userData && userData.access) {
        login(userData);
        setAlert({ type: "success", message: "Inicio de sesión exitoso ✅" });
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setAlert({ type: "error", message: "Credenciales inválidas" });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Error al conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f6fa", // fondo gris claro tipo AQ1
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
          <Avatar sx={{ mx: "auto", bgcolor: "primary.main", mb: 1 }}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
            Iniciar Sesión
          </Typography>

          {alert && (
            <Alert severity={alert.type} sx={{ mb: 2, textAlign: "center" }}>
              {alert.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              name="email"
              placeholder="Correo electrónico"
              fullWidth
              required
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              name="password"
              placeholder="Contraseña"
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Recordar sesión"
              sx={{ mb: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Cargando..." : "Entrar"}
            </Button>

            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Link variant="caption" sx={{ cursor: "pointer" }}>
                ¿No tienes cuenta? Regístrate
              </Link>
              <Link variant="caption" sx={{ cursor: "pointer" }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
