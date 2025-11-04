import { AppBar, Toolbar, Typography, Button, Box } from "../../libs/mui";
import { useAuth } from "../../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";

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
        backgroundColor: "#1976d2",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Título con logo opcional */}
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 600, letterSpacing: 0.5 }}
        >
          Inventory Dashboard
        </Typography>

        {/* Sección derecha */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: 500 }}
            >
              {user.username}
            </Typography>
          )}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              border: "1px solid white",
              borderRadius: "10px",
              px: 2,
              py: 0.5,
              textTransform: "none",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
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
