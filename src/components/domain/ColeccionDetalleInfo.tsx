import { Link } from "react-router-dom";

type Props = {
  categoria: string;
  creadorId: number | null;
  creadorNombre: string;
  esPublica: boolean;
  descripcion: string;
  logueado?: boolean;
  esPropio?: boolean;
};

export default function ColeccionDetalleInfo({
  categoria, creadorId, creadorNombre, esPublica, descripcion, logueado = false, esPropio = false
}: Props) {

  return (
    <div className="coleccion-detalle-card">
      <h3 className="coleccion-detalle-card-title">
        <i className="fas fa-info-circle" /> Detalles
      </h3>

      <div className="coleccion-detalle-grid">

        <div className="coleccion-detalle-item">
          <span className="coleccion-detalle-label">Categoría</span>
          <span className="badge-categoria">{categoria || "General"}</span>
        </div>

        <div className="coleccion-detalle-item">
          <span className="coleccion-detalle-label">Creador</span>
          <span className="coleccion-detalle-value">
            {creadorId !== null && (esPropio || logueado)
              ? <Link to={`/usuario/${creadorId}/perfil`} className="coleccion-info-link">
                  {creadorNombre?.trim() || "Mi perfil"}
                </Link>
              : <span>{creadorNombre?.trim() || "Desconocido"}</span>
            }
          </span>
        </div>

        <div className="coleccion-detalle-item">
          <span className="coleccion-detalle-label">Visibilidad</span>
          <span className="coleccion-detalle-value">
            <i className={`fas fa-${esPublica ? "globe" : "lock"}`} />
            {esPublica ? " Pública" : " Privada"}
          </span>
        </div>

        <div className="coleccion-detalle-item">
          <span className="coleccion-detalle-label">Descripción</span>
          <span className="coleccion-detalle-value">
            {descripcion || "No hay descripción disponible."}
          </span>
        </div>

      </div>
    </div>
  );
}