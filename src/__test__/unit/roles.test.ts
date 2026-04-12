import { describe, it, expect } from "vitest";
import { getRolBadgeClass, getRolIcon } from "../../utils/roles";

describe("getRolBadgeClass", () => {
  it("devuelve la clase de admin para ADMIN", () => {
    expect(getRolBadgeClass("ADMIN")).toBe("perfil-rol-admin");
  });

  it("devuelve la clase de mods para MODS", () => {
    expect(getRolBadgeClass("MODS")).toBe("perfil-rol-mods");
  });

  it("devuelve la clase de user para cualquier otro valor", () => {
    expect(getRolBadgeClass("USER")).toBe("perfil-rol-user");
  });

  it("devuelve la clase de user con undefined", () => {
    expect(getRolBadgeClass(undefined)).toBe("perfil-rol-user");
  });
});

describe("getRolIcon", () => {
  it("devuelve el icono de admin para ADMIN", () => {
    expect(getRolIcon("ADMIN")).toBe("fa-shield-alt");
  });

  it("devuelve el icono de mods para MODS", () => {
    expect(getRolIcon("MODS")).toBe("fa-star");
  });

  it("devuelve el icono de user para cualquier otro valor", () => {
    expect(getRolIcon("USER")).toBe("fa-user");
  });

  it("devuelve el icono de user con undefined", () => {
    expect(getRolIcon(undefined)).toBe("fa-user");
  });
});