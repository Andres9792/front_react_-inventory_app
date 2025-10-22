import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layouts/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sites from "../pages/Sites/Sites";
import { Feeders, Ubicacion } from "../pages";
import Proxmox from "../pages/Proxmox/Proxmox";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rutas protegidas que usan el Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* / */}
          <Route path="dashboard" element={<Dashboard />} /> {/* /dashboard */}
          <Route path="sites" element={<Sites />} /> {/* /sites */}
          <Route path="proxmoxs" element={<Proxmox />} /> {/* /sites */}
          <Route path="ubicaciones" element={<Ubicacion />} /> {/* /sites */}
          <Route path="feeders" element={<Feeders />} /> {/* /sites */}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
