import { Link } from "react-router-dom";
import { resolveImgUrl } from "../../utils/imagenes";
import defaultImg from "../../assets/default-collection.jpg";
import type { ColeccionDetallePanelProps } from "../../types/coleccion";

export default function ColeccionDetallePanel({
  coleccion,
  logueado = false,
  esPropio = false,
  yaUnido,
  uniendose,
  onUnirse,
  favorita,
  onTogFavorita,
  togFav,
  misItemsUrl,
}: ColeccionDetallePanelProps) {
  const imgSrc = resolveImgUrl(coleccion.imagenPortada) || defaultImg;

  return (
    <>
      <div className="coleccion-detalle-img-wrap">
        <img
          src={imgSrc}
          alt={coleccion.nombre ? `Imagen de la colección ${coleccion.nombre}` : "Imagen de colección"}
          className="coleccion-detalle-img"
        />
        {coleccion.usableComoPlantilla && (
          <span className="coleccion-detalle-plantilla-badge">
            <i className="fas fa-copy" /> Plantilla
          </span>
        )}
      </div>

      <div className="coleccion-detalle-info">

        <div className="coleccion-detalle-header">
          <h2 className="coleccion-detalle-nombre">{coleccion.nombre}</h2>
          {onTogFavorita && (
            <button
              className="btn btn-outline btn-fav-icon"
              onClick={onTogFavorita}
              disabled={togFav}
            >
              <i className={`fa-star ${favorita ? "fas star-activa" : "far star-inactiva"}`} />
            </button>
          )}
        </div>

        <div className="coleccion-detalle-card">
          <h3 className="coleccion-detalle-card-title">
            <i className="fas fa-info-circle" /> Detalles
          </h3>
          <div className="coleccion-detalle-grid">
            <div className="coleccion-detalle-item">
              <span className="coleccion-detalle-label">Categoría</span>
              <span className="badge-categoria">{coleccion.categoria || "General"}</span>
            </div>
            <div className="coleccion-detalle-item">
              <span className="coleccion-detalle-label">Creador</span>
              <span className="coleccion-detalle-value">
                {coleccion.idCreador !== null && (esPropio || logueado)
                  ? <Link to={`/usuario/${coleccion.idCreador}/perfil`} className="coleccion-info-link">
                      {coleccion.nombreCreador?.trim() || "Mi perfil"}
                    </Link>
                  : <span>{coleccion.nombreCreador?.trim() || "Desconocido"}</span>
                }
              </span>
            </div>
            <div className="coleccion-detalle-item">
              <span className="coleccion-detalle-label">Visibilidad</span>
              <span className="coleccion-detalle-value">
                <i className={`fas fa-${coleccion.esPublica ? "globe" : "lock"}`} />
                {coleccion.esPublica ? " Pública" : " Privada"}
              </span>
            </div>
            <div className="coleccion-detalle-item">
              <span className="coleccion-detalle-label">Descripción</span>
              <span className="coleccion-detalle-value">
                {coleccion.descripcion || "No hay descripción disponible."}
              </span>
            </div>
          </div>
        </div>

        {onUnirse && (
          <div className="coleccion-detalle-cta">
            {!logueado ? (
              <>
                <p className="coleccion-detalle-cta-texto">
                  <i className="fas fa-copy" /> Esta colección es una plantilla reutilizable.
                </p>
                <Link to="/login" className="btn btn-primary btn-lg">
                  <i className="fas fa-sign-in-alt" /> Inicia sesión para usarla
                </Link>
              </>
            ) : yaUnido ? (
              <p className="coleccion-detalle-cta-texto coleccion-detalle-cta-ok">
                <i className="fas fa-check-circle" /> Ya tienes esta colección en tu perfil
              </p>
            ) : (
              <>
                <p className="coleccion-detalle-cta-texto">
                  <i className="fas fa-copy" /> Añádela a tu perfil y lleva tu propio seguimiento.
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={onUnirse}
                  disabled={uniendose}
                >
                  <i className="fas fa-plus" />
                  {uniendose ? " Añadiendo..." : " Usar esta plantilla"}
                </button>
              </>
            )}
          </div>
        )}

        {misItemsUrl && (
          <div className="coleccion-detalle-card">
            <h3 className="coleccion-detalle-card-title">
              <i className="fas fa-layer-group" /> Mis items
            </h3>
            <Link to={misItemsUrl} className="btn btn-primary">
              <i className="fas fa-sliders-h" /> Ajustar visibilidad y estado
            </Link>
          </div>
        )}

      </div>
    </>
  );
}