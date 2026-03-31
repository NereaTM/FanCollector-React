type DateStyle = "short" | "long";

export function formatDate(
  fechaISO: string | null | undefined,
  { locale = "es-ES", style = "short" }: { locale?: string; style?: DateStyle } = {}
) {
  if (!fechaISO) return "Fecha desconocida";
  const d = new Date(fechaISO);
  if (Number.isNaN(d.getTime())) return "Fecha desconocida";

  const opts: Intl.DateTimeFormatOptions =
    style === "long"
      ? { year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" };

  return d.toLocaleDateString(locale, opts);
}