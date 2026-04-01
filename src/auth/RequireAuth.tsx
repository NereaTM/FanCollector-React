import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token, loadingSession } = useAuth();
  const location = useLocation();

  // Mientras comprobamos la sesión, esperamos
  if (loadingSession) {
    return <div className="loading"><p>Cargando sesión...</p></div>
  }
  // Si no hay sesión, redirigimos al login
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  return <>{children}</>;
}