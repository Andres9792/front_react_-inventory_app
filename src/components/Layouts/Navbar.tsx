import { AppBar, Toolbar, Typography, Button, Box } from "../../libs/mui";
import { useAuth } from "../../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

interface NavbarProps {
  drawerWidth: number;
}

const Navbar = ({ drawerWidth }: NavbarProps) => {
  const { logout, user } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        // Fondo blanco con ligera transparencia (efecto glassmorphism)
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        backdropFilter: "blur(8px)", 
        // Cambiamos la sombra pesada por una línea muy fina
        boxShadow: "none",
        borderBottom: "1px solid #f0f0f0",
        color: "#1A2027", // Texto oscuro para que resalte en el blanco
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64 }}>
        
        {/* Título más sutil */}
        <Typography
          variant="subtitle1"
          noWrap
          sx={{ 
            fontWeight: 700, 
            color: "#2D3748",
            fontSize: "1.1rem" 
          }}
        >
          Inventory Dashboard
        </Typography>

        {/* Sección derecha */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{ 
                  color: "#637381", 
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' } // Ocultar en pantallas muy pequeñas
                }}
              >
                {user.username}
              </Typography>
              {/* Avatar opcional para darle el toque Pro */}
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: "#007FFF", 
                  fontSize: "0.875rem",
                  fontWeight: 'bold' 
                }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          )}

          <Button
            onClick={logout}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              color: "#FF4842", // Color rojo suave para 'Salir'
              fontWeight: 600,
              borderRadius: "8px",
              px: 2,
              '&:hover': { 
                backgroundColor: "rgba(255, 72, 66, 0.08)",
              },
            }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;