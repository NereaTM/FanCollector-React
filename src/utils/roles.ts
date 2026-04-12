export function getRolBadgeClass(rol: string | undefined) {
  const r = (rol || "").toUpperCase();
  if (r === "ADMIN") return "perfil-rol-admin";
  if (r === "MODS" || r === "MOD") return "perfil-rol-mods";
  return "perfil-rol-user";
}

export function getRolIcon(rol: string | undefined) {
  const r = (rol || "").toUpperCase();
  if (r === "ADMIN") return "fa-shield-alt";
  if (r === "MODS") return "fa-star";
  return "fa-user";
}