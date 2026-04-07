import { fetchAPI } from "./apiClient";

// COLECCION
//GET
export function getColeccionById(id: number | string) {
  return fetchAPI(`/colecciones/${id}`);
}

export function getBuscarColecciones({
  nombre,
  categoria,
  nombreCreador,
  usableComoPlantilla,
}: {
  nombre?: string;
  categoria?: string;
  nombreCreador?: string;
  usableComoPlantilla?: boolean;
} = {}) {
  const params = new URLSearchParams();
  if (nombre?.trim()) params.set("nombre", nombre.trim());
  if (categoria?.trim()) params.set("categoria", categoria.trim());
  if (nombreCreador?.trim()) params.set("nombreCreador", nombreCreador.trim());
  if (usableComoPlantilla === true) params.set("usableComoPlantilla", "true");
  const query = params.toString();
  return fetchAPI(query ? `/colecciones?${query}` : "/colecciones");
}

// POST
export function crearColeccion(dto: FormData |  Record<string, unknown>) {
  return fetchAPI("/colecciones", { method: "POST", body: dto });
}

// PUT
export function editarColeccion(id: number | string, dto: FormData |  Record<string, unknown>) {
  return fetchAPI(`/colecciones/${id}`, { method: "PUT", body: dto });
}

// DELETE 

export function borrarColeccion(id: number | string) {
  return fetchAPI(`/colecciones/${id}`, { method: "DELETE" });
}

// USUARIO-COLECCION

// GET
export function getMisUsuarioColecciones(idUsuario: number | string) {
  return fetchAPI(`/usuario-colecciones?idUsuario=${encodeURIComponent(idUsuario)}`);
}

export function getUsuarioColeccionPorUsuarioYColeccion(idUsuario: number | string, idColeccion: number | string) {
  return fetchAPI(
    `/usuario-colecciones?idUsuario=${encodeURIComponent(idUsuario)}&idColeccion=${encodeURIComponent(idColeccion)}`
  );
}

export function getMisUsuarioColeccionesDetalle(idUsuario: number | string) {
  return fetchAPI(`/usuario-colecciones/v2?idUsuario=${encodeURIComponent(idUsuario)}`);
}

// POST
export function crearUsuarioColeccion(dto: Record<string, unknown>) {
  return fetchAPI("/usuario-colecciones/v2", { method: "POST", body: dto });
}

// PATCH
export function patchFavorita (idUsuarioColeccion: number | string, esFavorita: boolean) {
  return fetchAPI(`/usuario-colecciones/${idUsuarioColeccion}/favorita`, { method: "PATCH", body: { esFavorita } });
}

// DELETE
export function eliminarUsuarioColeccion(id: number | string) {
  return fetchAPI(`/usuario-colecciones/v2/${id}`, { method: "DELETE" });
}


