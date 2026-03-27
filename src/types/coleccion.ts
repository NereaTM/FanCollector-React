export type Coleccion = {
  id: number;
  idCreador: number;
  nombreCreador: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagenPortada: string | null;
  fechaCreacion: string;
  esPublica: boolean;
  usableComoPlantilla: boolean;
};

export type ColeccionConRol = {
  coleccion: Coleccion;
  esCreador: boolean;
};

export type UsuarioColeccion = {
  id: number;
  idUsuario: number;
  idColeccion: number;
  esFavorita: boolean;
  esCreador: boolean;
  esVisible: boolean;
  fechaAgregada: string;
};

export type ColeccionInDTO = {
  idCreador: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  imagenPortada?: string;
  esPublica?: boolean;
  usableComoPlantilla?: boolean;
};

export type ColeccionPutDTO = {
  nombre: string;
  descripcion?: string;
  categoria: string;
  imagenPortada?: string;
  esPublica?: boolean;
  usableComoPlantilla?: boolean;
};