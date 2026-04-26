import type { RolUsuario } from "./usuario";

export type AuthUser = {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol: RolUsuario;
  urlAvatar: string | null;
  descripcion?: string;
  contactoPublico?: string;
  fechaRegistro?: string;
};

export type RegisterRequest = {
  nombre: string;
  apellido?: string;
  email: string;
  contrasena: string;
};