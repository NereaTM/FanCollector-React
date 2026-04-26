import { Link } from "react-router-dom";
import defaultImg from "../../assets/default-collection.jpg";
import { resolveImgUrl } from "../../utils/imagenes";
import type { ItemCardProps } from "../../types/item";


export default function ItemCard({
  item,
  usuarioItem = null,
  puedeEditar = false,
  idColeccion = null,
  volverUrl = null,
  onEliminar = null,
}: ItemCardProps) {
  const imgSrc = resolveImgUrl(item.imagenUrl) || defaultImg;
  const estado = usuarioItem?.estado ?? null;
  const cantidad = usuarioItem?.cantidad ?? null;
  const notas = usuarioItem?.notas ?? null;

  return (
    <div className="icard">

      <div className="icard-header">
        <span className={`icard-badge badge-estado-${estado ?? "none"}`}>
          {estado ?? "Sin estado"}
        </span>
        {item.rareza && (
          <span className={`icard-badge badge-rareza-${item.rareza}`}>
            {item.rareza}
          </span>
        )}
      </div>

      <div className="icard-img-wrap">
        <img src={imgSrc} alt={item.nombre || "Item"} className="icard-img" />
        {puedeEditar && idColeccion && (
          <div className="icard-actions">
            <Link
              to={`/colecciones/${idColeccion}/items/${item.id}/editar${
                volverUrl ? `?from=${encodeURIComponent(volverUrl)}` : ""
              }`}
              className="icard-btn icard-btn-edit"
              aria-label={`Editar ${item.nombre}`}
              title="Editar"
            >
              <i className="fas fa-pen" />
            </Link>

            {onEliminar && (
              <button
                className="icard-btn icard-btn-del"
                onClick={() => onEliminar(item.id)}
                aria-label={`Eliminar ${item.nombre}`}
                title="Eliminar"
              >
                <i className="fas fa-trash" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="icard-body">
        {item.tipo && <span className="icard-tipo">{item.tipo}</span>}
        <h3 className="icard-nombre">{item.nombre}</h3>
        {item.descripcion && (
          <p className="icard-desc">{item.descripcion}</p>
        )}
        <div className="icard-meta">
          {item.anioLanzamiento && (
            <span className="icard-meta-item">
              <i className="fas fa-calendar-alt" /> {item.anioLanzamiento}
            </span>
          )}
          {cantidad !== null && (
            <span className="icard-meta-item">
              <i className="fas fa-layer-group" /> ×{cantidad}
            </span>
          )}
        </div>
        {notas && (
          <p className="icard-notas">
            <i className="fas fa-sticky-note" /> {notas}
          </p>
        )}
      </div>

    </div>
  );
}