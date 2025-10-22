import { AppBar, Toolbar, Typography } from "../../libs/mui";

interface NavbarProps {
  drawerWidth: number;
}

const Navbar = ({ drawerWidth }: NavbarProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "#1976d2",
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Inventory Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
