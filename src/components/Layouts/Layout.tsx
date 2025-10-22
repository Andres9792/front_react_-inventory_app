import { Box } from "../../libs/mui";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar */}
      <Navbar drawerWidth={drawerWidth} />

      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f4f6f8",
          p: 3,
          mt: 8, // margen superior para que no se tape con el navbar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
