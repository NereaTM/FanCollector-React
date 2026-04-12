import { describe, it, expect, beforeEach } from "vitest";
import { getToken, saveToken, clearSession, getIdFromToken } from "../../auth/authStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("saveToken / getToken", () => {
  it("guarda y recupera el token", () => {
    saveToken("mi-token");
    expect(getToken()).toBe("mi-token");
  });

  it("devuelve null si no hay token guardado", () => {
    expect(getToken()).toBeNull();
  });
});

describe("clearSession", () => {
  it("elimina el token de localStorage", () => {
    saveToken("mi-token");
    clearSession();
    expect(getToken()).toBeNull();
  });
});

describe("getIdFromToken", () => {
  it("extrae el id del payload de un JWT válido", () => {
    // JWT con payload { id: 42 }
    const payload = btoa(JSON.stringify({ id: 42 }));
    const token = `header.${payload}.signature`;
    saveToken(token);
    expect(getIdFromToken()).toBe("42");
  });

  it("devuelve null si no hay token", () => {
    expect(getIdFromToken()).toBeNull();
  });

  it("devuelve null si el token está malformado", () => {
    saveToken("token-sin-puntos");
    expect(getIdFromToken()).toBeNull();
  });

  it("devuelve null si el payload no contiene id", () => {
    const payload = btoa(JSON.stringify({ sub: "usuario" }));
    const token = `header.${payload}.signature`;
    saveToken(token);
    expect(getIdFromToken()).toBeNull();
  });
});