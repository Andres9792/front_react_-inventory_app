import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon, // Importante para el look pro
  Toolbar,
  Typography,
  Box
} from "../../libs/mui";
import { Link, useLocation } from "react-router-dom";
// Tip: Instala @mui/icons-material si no los tienes
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

interface SidebarProps {
  drawerWidth: number;
}

const Sidebar = ({ drawerWidth }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { text: "Sites", path: "/sites", icon: <LanguageIcon fontSize="small" /> },
    { text: "Proxmox", path: "/proxmoxs", icon: <StorageIcon fontSize="small" /> },
    { text: "Ubicaciones", path: "/ubicaciones", icon: <PlaceIcon fontSize="small" /> },
    { text: "Feeders", path: "/feeders", icon: <SettingsInputComponentIcon fontSize="small" /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #f0f0f0", // Línea muy sutil
          backgroundColor: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A2027', letterSpacing: '-0.5px' }}>
          AQ1 <Box component="span" sx={{ color: '#007FFF' }}>Ecuador</Box>
        </Typography>
      </Toolbar>

      <Box sx={{ px: 2, mt: 1 }}> {/* Contenedor para dar aire lateral */}
        <List>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: '8px', // Bordes redondeados modernos
                    transition: 'all 0.2s',
                    backgroundColor: active ? '#f0f7ff' : 'transparent',
                    color: active ? '#007FFF' : '#637381',
                    '&:hover': {
                      backgroundColor: '#f4f6f8',
                      color: '#1A2027',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 38, 
                    color: active ? '#007FFF' : 'inherit' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.875rem', 
                      fontWeight: active ? 600 : 500 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;