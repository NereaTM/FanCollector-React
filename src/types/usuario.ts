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

export type PerfilVistaProps = {
  nombre: string;
  rol: RolUsuario;
  fechaRegistro?: string;
  avatarSrc: string;
  email?: string;
  descripcion?: string;
  contactoPublico?: string;
  // Botones de cuenta
  esPropio?: boolean;
  puedeEditar?: boolean;
  editarUrl: string;
  cambiarPasswordUrl: string;
  onCerrarSesion?: () => void;
};
