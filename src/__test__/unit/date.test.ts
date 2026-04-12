import { describe, it, expect } from "vitest";
import { formatDate } from "../../utils/date";

describe("formatDate", () => {
  it("devuelve 'Fecha desconocida' con null", () => {
    expect(formatDate(null)).toBe("Fecha desconocida");
  });

  it("devuelve 'Fecha desconocida' con undefined", () => {
    expect(formatDate(undefined)).toBe("Fecha desconocida");
  });

  it("devuelve 'Fecha desconocida' con una cadena no válida", () => {
    expect(formatDate("no-es-una-fecha")).toBe("Fecha desconocida");
  });

  it("formatea correctamente en estilo short", () => {
    const resultado = formatDate("2024-01-15", { style: "short" });
    expect(resultado).toMatch(/ene/i);
    expect(resultado).toContain("2024");
  });

  it("formatea correctamente en estilo long", () => {
    const resultado = formatDate("2024-01-15", { style: "long" });
    expect(resultado).toMatch(/enero/i);
    expect(resultado).toContain("2024");
  });
});