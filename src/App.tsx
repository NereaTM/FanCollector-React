import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/AuthContext";


import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";

function SessionExpiryWatcher() {
  const { token, logout } = useAuth();
 
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as { expiracion: number };
      const expMs = payload.expiracion * 1000; // exp viene en segundos, lo pasamos a ms
      const avisarMs = expMs - Date.now() - 2 * 60 * 1000; // 2 min antes
 
      if (avisarMs <= 0) return;
 
      const avisoTimeout = setTimeout(() => {
       toast("Tu sesión expirará en 2 minutos.", {
          icon: <i className="fas fa-exclamation-triangle"></i>
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