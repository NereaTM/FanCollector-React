import { useRef, useState } from "react";

/**
 * Hook reutilizable para la previsualización de imágenes en formularios.
 *
 * - En formularios de creación: pasa imagenInicial con la imagen por defecto.
 * - En formularios de edición: llama a setImagenServidor() tras cargar los datos del servidor.
 *
 * @param imagenInicial  URL de la imagen que se muestra antes de que el usuario elija archivo.
 */
export function useImagenPreview(imagenInicial: string = "") {
  const [previewSrc, setPreviewSrc] = useState<string>(imagenInicial);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewSrc(URL.createObjectURL(file));
  };

  // Para formularios de edición: actualiza el preview con la imagen que llega del servidor
  const setImagenServidor = (url: string) => setPreviewSrc(url);

  return { previewSrc, fileRef, handleFileChange, setImagenServidor };
}
