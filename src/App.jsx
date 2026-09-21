import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'

import LandingPage from './pages/public/LandingPage'
import SolicitudEmpresaPage from './pages/public/SolicitudEmpresaPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import TachosPage from './pages/tachos/TachosPage'
import CarritosPage from './pages/carritos/CarritosPage'
import AsignacionesPage from './pages/asignaciones/AsignacionesPage'
import MapaPage from './pages/mapa/MapaPage'
import ConfiguracionPage from './pages/configuracion/ConfiguracionPage'


import SuperadminLayout from './layouts/SuperadminLayout'
import SuperadminHome from './pages/superadmin/SuperadminHome'
import OrganizacionesPage from './pages/superadmin/OrganizacionesPage'
import InventarioPage from './pages/superadmin/InventarioPage'

import AlertasPage from './pages/alertas/AlertasPage'
import TurnoPage from './pages/turnos/TurnoPage'
import RecoleccionesPage from './pages/recolecciones/RecoleccionesPage'
import IncidenciasPage from './pages/incidencias/IncidenciasPage'

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* ===== PÚBLICO ===== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/solicitud-empresa" element={<SolicitudEmpresaPage />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>


            {/* ===== SUPERADMIN ===== */}
            <Route element={<ProtectedRoute rolesPermitidos={['superadmin']} />}>
              <Route path="/superadmin" element={<SuperadminLayout />}>
                <Route index element={<SuperadminHome />} />
                <Route path="organizaciones" element={<OrganizacionesPage />} />
                <Route path="inventario" element={<InventarioPage />} />
              </Route>
            </Route>

            {/* ===== PANEL ORGANIZACIÓN ===== */}
            <Route
              element={
                <ProtectedRoute
                  rolesPermitidos={[
                    'admin',
                    'supervisor',
                    'operario',
                    'empleado',
                    'particular',
                  ]}
                />
              }
            >
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="tachos" element={<TachosPage />} />
                <Route path="carritos" element={<CarritosPage />} />
                <Route path="asignaciones" element={<AsignacionesPage />} />
                <Route path="mapa" element={<MapaPage />} />
                <Route path="alertas" element={<AlertasPage />} />
                <Route path="turno" element={<TurnoPage />} />
                <Route path="recolecciones" element={<RecoleccionesPage />} />
                <Route path="incidencias" element={<IncidenciasPage />} />
                <Route path="usuarios" element={<div className="p-4">Usuarios (próximamente)</div>} />
                <Route path="configuracion" element={<ConfiguracionPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App