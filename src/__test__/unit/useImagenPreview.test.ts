import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useImagenPreview } from "../../hooks/useImagenPreview";

describe("useImagenPreview", () => {
  it("el estado inicial es la imagenInicial que se pasa", () => {
    const { result } = renderHook(() =>
      useImagenPreview("https://ejemplo.com/imagen.jpg")
    );
    expect(result.current.previewSrc).toBe("https://ejemplo.com/imagen.jpg");
  });

  it("el estado inicial es cadena vacía si no se pasa imagenInicial", () => {
    const { result } = renderHook(() => useImagenPreview());
    expect(result.current.previewSrc).toBe("");
  });

  it("setImagenServidor actualiza previewSrc", () => {
    const { result } = renderHook(() => useImagenPreview());
    act(() => {
      result.current.setImagenServidor("https://servidor.com/foto.png");
    });
    expect(result.current.previewSrc).toBe("https://servidor.com/foto.png");
  });

  it("handleFileChange actualiza previewSrc con la URL del archivo", () => {
    const objectUrl = "blob:http://localhost/fake-url";
    vi.stubGlobal("URL", { createObjectURL: vi.fn().mockReturnValue(objectUrl) });

    const { result } = renderHook(() => useImagenPreview());

    const fakeFile = new File(["contenido"], "foto.jpg", { type: "image/jpeg" });
    const fakeEvent = {
      target: { files: [fakeFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(fakeEvent);
    });

    expect(result.current.previewSrc).toBe(objectUrl);
  });
});