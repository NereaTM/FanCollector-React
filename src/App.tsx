import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";


import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Colecciones from "./pages/Coleccion/DirectorioColecciones";
import PerfilPropio from "./pages/Profile/Perfil";
import PerfilEditar from "./pages/Profile/PerfilEditar";
import NotFoundPage from "./pages/NotFoundPage";
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
        });
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


      {/* ── Rutas protegidas ── */}
        <Route path="perfil" element={<RequireAuth><PerfilPropio /></RequireAuth>} />
        <Route path="perfil/editar" element={<RequireAuth><PerfilEditar /></RequireAuth>} />



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