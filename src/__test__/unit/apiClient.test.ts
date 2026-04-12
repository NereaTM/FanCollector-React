import { describe, it, expect } from "vitest";
import { ApiError, getApiErrorMessage } from "../../data/apiClient";

describe("ApiError", () => {
  it("asigna correctamente status y message", () => {
    const err = new ApiError("Error de prueba", 404, null);
    expect(err.message).toBe("Error de prueba");
    expect(err.status).toBe(404);
  });

  it("parsea fieldErrors del objeto data", () => {
    const data = { errors: { email: "ya existe", nombre: "requerido" } };
    const err = new ApiError("Validación fallida", 400, data);
    expect(err.fieldErrors).toEqual({ email: "ya existe", nombre: "requerido" });
  });

  it("deja fieldErrors vacío si data no tiene errors", () => {
    const err = new ApiError("Error", 500, { message: "fallo interno" });
    expect(err.fieldErrors).toEqual({});
  });

  it("deja fieldErrors vacío si data es null", () => {
    const err = new ApiError("Error", 500, null);
    expect(err.fieldErrors).toEqual({});
  });
});

describe("getApiErrorMessage", () => {
  it("devuelve los fieldErrors formateados si los hay", () => {
    const data = { errors: { email: "ya existe" } };
    const err = new ApiError("Validación", 400, data);
    expect(getApiErrorMessage(err)).toBe("email: ya existe");
  });

  it("devuelve el message si no hay fieldErrors", () => {
    const err = new ApiError("Algo salió mal", 500, null);
    expect(getApiErrorMessage(err)).toBe("Algo salió mal");
  });

  it("devuelve el message de un Error genérico", () => {
    const err = new Error("Error genérico");
    expect(getApiErrorMessage(err)).toBe("Error genérico");
  });

  it("devuelve 'Error desconocido' con un valor no reconocido", () => {
    expect(getApiErrorMessage("cadena rara")).toBe("Error desconocido");
    expect(getApiErrorMessage(null)).toBe("Error desconocido");
    expect(getApiErrorMessage(42)).toBe("Error desconocido");
  });
});