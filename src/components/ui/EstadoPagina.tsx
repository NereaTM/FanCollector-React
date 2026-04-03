import { Link } from "react-router-dom";

type Accion = {
  label: string;
  onClick: () => void;
};

type Props = {
  loading?: string;
  error?: string;
  icono?: string;
  titulo?: string;
  texto?: string;
  volverUrl?: string;
  volverTexto?: string;
  accion?: Accion;
};

export default function EstadoPagina({
  loading, error, icono, titulo, texto, volverUrl, volverTexto, accion,
}: Props) {
  if (loading) return (
    <div className="loading" style={{ padding: "4rem" }}>
      <i className="fas fa-spinner fa-spin" />
      <p>{loading}</p>
    </div>
  );

  const iconoFinal = icono ?? (error ? "fa-exclamation-triangle" : "fa-info-circle");

  return (
    <div className="loading" style={{ padding: "4rem" }}>
      <i className={`fas ${iconoFinal}`} />
      {titulo && <h3>{titulo}</h3>}
      {(error || texto) && <p>{error || texto}</p>}
      {volverUrl && (
        <Link to={volverUrl} className="btn btn-primary" style={{ marginTop: "1rem" }}>
          <i className="fas fa-arrow-left" /> {volverTexto ?? "Volver"}
        </Link>
      )}
      {accion && (
        <button className="btn btn-primary" onClick={accion.onClick} style={{ marginTop: "1rem" }}>
          {accion.label}
        </button>
      )}
    </div>
  );
}