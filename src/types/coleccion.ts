export type Coleccion = {
  id: number;
  idCreador: number;
  nombreCreador: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  imagenPortada: string | null;
  fechaCreacion: string;
  esPublica: boolean;
  usableComoPlantilla: boolean;
};

export type UsuarioColeccionDetalle = {
  id: number;
  idUsuario: number;
  idColeccion: number;
  esFavorita: boolean;
  esCreador: boolean;
  esVisible: boolean;
  fechaAgregada: string;
  coleccion: Coleccion;
  nombreUsuario: string;
};

export type Relacion = {
  id: number;
  esFavorita: boolean;
} | null;

export type ColeccionForm = {
  nombre: string;
  descripcion: string;
  categoria: string;
  esPublica: boolean;
  usableComoPlantilla: boolean;
};

export type ColeccionPutDTO = {
  nombre: string;
  descripcion?: string;
  categoria: string;
  imagenPortada?: string;
  esPublica?: boolean;
  usableComoPlantilla?: boolean;
};

export type ColeccionCardProps = {
  coleccion: Coleccion;
  // MisColecciones
  esFavorita?: boolean;
  esCreador?: boolean;
  fechaAgregada?: string;
  // mis-colecciones vs colecciones
  urlBase?: string;
};

export type ColeccionDetallePanelProps = {
  coleccion: Coleccion;
  logueado?: boolean;
  esPropio?: boolean;
  // relación usuario-colección
  favorita?: boolean;
  onTogFavorita?: () => void;
  togFav?: boolean;
  misItemsUrl?: string;
  // acción de unirse a plantilla
  yaUnido?: boolean;
  uniendose?: boolean;
  onUnirse?: () => void;
};