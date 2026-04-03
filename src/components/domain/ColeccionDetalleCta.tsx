import { Link } from "react-router-dom";

type Props = {
  logueado: boolean;
  yaUnido: boolean;
  uniendose: boolean;
  onUnirse: () => void;
};

export default function ColeccionDetalleCta({
  logueado,
  yaUnido,
  uniendose,
  onUnirse
}: Props) {

  if (!logueado) {
    return (
      <div className="coleccion-detalle-cta">
        <p className="coleccion-detalle-cta-texto">
          <i className="fas fa-copy" /> Esta colección es una plantilla reutilizable.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">
          <i className="fas fa-sign-in-alt" /> Inicia sesión para usarla
        </Link>
      </div>
    );
  }

  if (yaUnido) {
    return (
      <div className="coleccion-detalle-cta">
        <p className="coleccion-detalle-cta-texto coleccion-detalle-cta-ok">
          <i className="fas fa-check-circle" /> Ya tienes esta colección en tu perfil
        </p>
      </div>
    );
  }

  return (
    <div className="coleccion-detalle-cta">
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
    </div>
  );
}