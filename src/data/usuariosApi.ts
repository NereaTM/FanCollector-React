import { fetchAPI } from "./apiClient";
import type { AuthUser } from "../types/auth";

// GET 
export function getUsuarioById(id: number | string) {
  return fetchAPI<AuthUser>(`/usuarios/${id}`);
}

// PUT
export function editarUsuario(id: number | string, dto: FormData | Record<string, unknown>) {
  return fetchAPI(`/usuarios/${id}`, { method: "PUT", body: dto as Record<string, unknown> });
}

// PATCH
export function cambiarContrasena(id: number | string, contrasena: string) {
  return fetchAPI(`/usuarios/${id}/contrasena`, { method: "PATCH", body: { contrasena } });
}

export function cambiarRol(id: number | string, rol: string) {
  return fetchAPI(`/usuarios/${id}/rol`, { method: "PATCH", body: { rol } });
}

// DELETE
export function eliminarUsuario(id: number | string) {
  return fetchAPI(`/usuarios/${id}`, { method: "DELETE" });
}