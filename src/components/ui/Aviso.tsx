import type { ReactNode } from "react";

type TipoAviso = "info" | "warning" | "success";

const TIPOS: Record<TipoAviso, { clase: string; icono: string }> = {
  info: { clase: "aviso-info", icono: "fa-triangle-exclamation" },
  warning: { clase: "aviso-warning", icono: "fa-triangle-exclamation" },
  success: { clase: "aviso-success", icono: "fa-circle-check" },
};

type Props = {
  tipo?: TipoAviso;
  children: ReactNode;
};

export default function Aviso({ tipo = "info", children }: Props) {
  const { clase, icono } = TIPOS[tipo] ?? TIPOS.info;
  return (
    <div className={clase}>
      <strong><i className={`fas ${icono}`} /> Aviso</strong>
      <span> {children}</span>
    </div>
  );
}