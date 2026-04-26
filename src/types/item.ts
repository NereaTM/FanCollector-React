export type Rareza = "COMUN" | "RARO" | "EPICO" | "LEGENDARIO";
export type EstadoItem = "TENGO" | "BUSCO" | "DROPEO" | "EN_CAMINO";

export type Item = {
  id: number;
  idColeccion: number;
  nombreColeccion: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  tipo: string | null;
  rareza: Rareza;
  anioLanzamiento: number | null;
};

export type UsuarioItemOut = {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  idColeccion: number;
  nombreColeccion: string;
  idItem: number;
  nombreItem: string;
  estado: EstadoItem;
  cantidad: number;
  notas: string | null;
  esVisible: boolean;
  fechaRegistro: string;
};

//(GET UI) a la v2 le añado lo de la v1 + lo nuevo
export type UsuarioItemDetalleDTO = UsuarioItemOut & {
  descripcionItem: string | null;
  imagenUrl: string | null;
  tipo: string | null;
  rareza: Rareza;
  anioLanzamiento: number | null;
};

export type ItemForm = {
  nombre: string;
  tipo: string;
  rareza: string;
  anioLanzamiento: string;
  descripcion: string;
};

export type FilaItem = {
  item: Item;
  ui: UsuarioItemDetalleDTO | null;
  esVisible: boolean;
  estado: EstadoItem;
  cantidad: number;
  notas: string;
  saving: boolean;
  guardado: boolean;
};

export type ItemCardProps = {
  item: Item;
  usuarioItem?: UsuarioItemOut | null;
  puedeEditar?: boolean;
  idColeccion?: number | null;
  volverUrl?: string | null;
  onEliminar?: ((id: number) => void) | null;
};