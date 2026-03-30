import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
 
export default function RequireRole({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) {
  const { user } = useAuth();
 
  // user.rol viene en mayúsculas del backend: USER | MODS | ADMIN
  const permitido = allowedRoles.map((r) => r.toUpperCase()).includes((user?.rol ?? "").toUpperCase());
 
  if (!permitido) return <Navigate to="/" replace />;
 
  return <>{children}</>;
}
 