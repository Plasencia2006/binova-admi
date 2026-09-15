import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import TachosPage from './pages/tachos/TachosPage'
import CarritosPage from './pages/carritos/CarritosPage'
import AsignacionesPage from './pages/asignaciones/AsignacionesPage'
import MapaPage from './pages/mapa/MapaPage'
import ConfiguracionPage from './pages/configuracion/ConfiguracionPage'

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Rutas privadas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="tachos" element={<TachosPage />} />
                <Route path="carritos" element={<CarritosPage />} />
                <Route path="asignaciones" element={<AsignacionesPage />} />
                <Route path="mapa" element={<MapaPage />} />
                <Route path="usuarios" element={<div className="p-4">Usuarios (próximamente)</div>} />
                <Route path="configuracion" element={<ConfiguracionPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App