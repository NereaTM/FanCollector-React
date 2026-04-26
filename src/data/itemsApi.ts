import { fetchAPI } from "./apiClient";

// ITEMS
// GET
export function getItemsPorColeccion(idColeccion: number | string) {
  return fetchAPI(`/items?idColeccion=${idColeccion}`);
}

export function getItemById(id: number | string) {
  return fetchAPI(`/items/${id}`);
}

// POST
export function crearItem(dto: FormData |  Record<string, unknown>) {
  return fetchAPI("/items", { method: "POST", body: dto });
}

// PUT
export function editarItem(id: number | string, dto: FormData |  Record<string, unknown>) {
  return fetchAPI(`/items/${id}`, { method: "PUT", body: dto });
}

// DELETE
export function borrarItem(id: number | string) {
  return fetchAPI(`/items/${id}`, { method: "DELETE" });
}


// USUARIO-ITEMS
// GET
export function getMisUsuarioItems(idUsuario: number | string) {
  return fetchAPI(`/usuario-items?idUsuario=${encodeURIComponent(idUsuario)}`);
}

export function getUsuarioItemsDetallados(idUsuario: number | string, idColeccion: number | string) {
  return fetchAPI(
    `/usuario-items/v2?idUsuario=${encodeURIComponent(idUsuario)}&idColeccion=${encodeURIComponent(idColeccion)}`
  );
}

export function getUsuarioItemsPorColeccion(idUsuario: number | string, idColeccion: number | string) {
  return fetchAPI(
    `/usuario-items?idUsuario=${encodeURIComponent(idUsuario)}&idColeccion=${encodeURIComponent(idColeccion)}`
  );
}

// POST
export function crearUsuarioItem(dto: Record<string, unknown>) {
  return fetchAPI("/usuario-items", { method: "POST", body: dto });
}

// PUT
export function actualizarUsuarioItem(idUsuarioItem: number | string, dto: Record<string, unknown>) {
  return fetchAPI(`/usuario-items/${idUsuarioItem}`, { method: "PUT", body: dto });
}

// DELETE
export function borrarUsuarioItem(idUsuarioItem: number | string) {
  return fetchAPI(`/usuario-items/${idUsuarioItem}`, { method: "DELETE" });
}


