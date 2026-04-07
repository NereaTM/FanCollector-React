import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";


import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";

import Colecciones from "./pages/Coleccion/DirectorioColecciones";
import ColeccionDetalle from "./pages/Coleccion/ColeccionDetalle";

import MisColecciones from "./pages/Coleccion/UsuarioColecciones";
import MisColeccionesDetalle from "./pages/Coleccion/UsuarioColeccionesDetalle";
import ColeccionesDeUsuario from "./pages/Coleccion/UsuarioColecciones";
import ColeccionCrear from "./pages/Coleccion/ColeccionCrear";

import ItemCrear from "./pages/Coleccion/ItemCrear";

import PerfilUsuario from "./pages/Perfil/Perfil";
import PerfilEditar from "./pages/Perfil/PerfilEditar";
import PerfilCambiarPassword from "./pages/Perfil/PerfilCambiarPassword";


function SessionExpiryWatcher() {
  const { token, logout } = useAuth();
 
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as { exp: number };
      const expMs = payload.exp * 1000; // exp viene en segundos, lo pasamos a ms
      const avisarMs = expMs - Date.now() - 2 * 60 * 1000; // 2 min antes
 
      if (avisarMs <= 0) return;
 
      const avisoTimeout = setTimeout(() => {
       toast("Tu sesión expirará en 2 minutos.", {
          icon: <i className="fas fa-exclamation-triangle" />, 
          style: { background: "#fff3cd",color: "#856404", border: "1px solid #ffeeba" },}
        );
      }, avisarMs);
 
      const cierreTimeout = setTimeout(() => {
        toast.error("Sesión expirada. Por favor inicia sesión de nuevo.");
        logout();
      }, expMs - Date.now());
 
      return () => {
        clearTimeout(avisoTimeout);
        clearTimeout(cierreTimeout);
      };
    } catch {
      // Si el token no es válido, ignore
    }
  }, [token, logout]);
 
  return null;
}


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ── Rutas públicas ── */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="colecciones" element={<Colecciones />} />
        <Route path="colecciones/:id" element={<ColeccionDetalle />} />


      {/* ── Rutas protegidas ── */}
        <Route path="usuario/:userId/perfil" element={<RequireAuth><PerfilUsuario /></RequireAuth>} />
        <Route path="usuario/:userId/perfil/editar" element={<RequireAuth><PerfilEditar /></RequireAuth>} />
        <Route path="usuario/:userId/perfil/cambiar-password" element={<RequireAuth><PerfilCambiarPassword /></RequireAuth>} />

        <Route path="mis-colecciones" element={<RequireAuth><MisColecciones /></RequireAuth>} />
        <Route path="usuario/:userId/colecciones"element={<RequireAuth><ColeccionesDeUsuario /></RequireAuth>  }/>
        <Route path="mis-colecciones/:id" element={<RequireAuth><MisColeccionesDetalle /></RequireAuth>} />
        <Route path="colecciones/:coleccionId/items/crear" element={<RequireAuth><ItemCrear /></RequireAuth>} />
        <Route path="colecciones/crear" element={<RequireAuth><ColeccionCrear /></RequireAuth>} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SessionExpiryWatcher />
      <AppRoutes />
    </AuthProvider>
  );
}