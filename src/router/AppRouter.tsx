import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layouts/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sites from "../pages/Sites/Sites";
import { Feeders, Ubicacion } from "../pages";
import Proxmox from "../pages/Proxmox/Proxmox";
import  Login from "../pages/auth/Login"; // 👈 tu página de login
import PrivateRoute from "./PrivateRoute"; // 👈 la protección
import { AuthProvider } from "../context/AuthContext"; // 👈 el contexto

function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*  Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/*  Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sites" element={<Sites />} />
            <Route path="proxmoxs" element={<Proxmox />} />
            <Route path="ubicaciones" element={<Ubicacion />} />
            <Route path="feeders" element={<Feeders />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRouter;
