export type RolUsuario = "USER" | "MODS" | "ADMIN";

export type UsuarioOut = {
  id: number;
  nombre: string;
  rol: RolUsuario;
  urlAvatar: string | null;
  descripcion: string | null;
  contactoPublico: string | null;
  fechaRegistro: string | null;
};

export type UsuarioAdminOut = UsuarioOut & {
  email: string;
};

export type UsuarioInDTO = {
  nombre: string;
  email: string;
  contrasena: string;
  urlAvatar?: string;
  descripcion?: string;
  contactoPublico?: string;
};

export type UsuarioPutDTO = {
  nombre: string;
  email: string;
  urlAvatar?: string;
  descripcion?: string;
  contactoPublico?: string;
};

export type UsuarioPasswordDTO = {
  contrasena: string;
};

export type UsuarioRolDTO = {
  rol: RolUsuario;
};

export type LoginDTO = {
  email: string;
  contrasena: string;
};

export type Relacion = {
  id: number;
  esFavorita: boolean;
} | null;