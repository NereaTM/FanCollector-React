import { Link } from "react-router-dom";
import defaultImg from "../../assets/default-collection.jpg";
import { resolveImgUrl } from "../../utils/imagenes";
import { formatDate } from "../../utils/date";
import type { Coleccion } from "../../types/coleccion";

type Props = {
  coleccion: Coleccion;
  // MisColecciones
  esFavorita?: boolean;
  esCreador?: boolean;
  fechaAgregada?: string;
  // mis-colecciones vs colecciones
  urlBase?: string;
};

export default function ColeccionCard({
  coleccion,
  esFavorita = false,
  esCreador = false,
  fechaAgregada,
  urlBase = "colecciones",
}: Props) {
  const imgSrc = resolveImgUrl(coleccion.imagenPortada) || defaultImg;
  const url = `/${urlBase}/${coleccion.id}`;

  return (
    <div className="card">
      <Link to={url} className="card-img-link">
        <img src={imgSrc} className="card-img-bg" aria-hidden="true" />
        <img src={imgSrc} alt={coleccion.nombre} className="card-img" />
        <span className="card-badge">{coleccion.categoria}</span>
        {esCreador && (
          <span className="card-badge card-badge--template">
            <i className="fas fa-crown" /> Creador
          </span>
        )}
        {!esCreador && coleccion?.usableComoPlantilla && (
          <span className="card-badge card-badge--template">
            <i className="fas fa-copy" /> Plantilla
          </span>
        )}
      </Link>
      <div className="card-body">
        <div className="card-badges">
          {esFavorita && (
            <span className="card-badge-inline" style={{ background: "#f0a500" }}>
              <i className="fas fa-star" /> Favorita
            </span>
          )}
        </div>
        <h3 className="card-title">{coleccion.nombre}</h3>
        <p className="card-desc">{coleccion.descripcion || "Sin descripción disponible"}</p>
        <div className="card-footer-info">
          {coleccion?.nombreCreador && (
            <span className="card-meta">
              <i className="fas fa-user" /> {coleccion.nombreCreador}
            </span>
          )}
          {fechaAgregada && (
            <span className="card-meta">
              <i className="fas fa-calendar-alt" /> {formatDate(fechaAgregada)}
            </span>
          )}
        </div>
        <Link to={url} className="card-link">
          Ver colección <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
    </div>
  );
}