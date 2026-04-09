import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { getRolBadgeClass, getRolIcon } from "../../utils/roles";
import type { PerfilVistaProps } from "../../types/usuario";


export default function PerfilVista({
  nombre, rol, fechaRegistro, avatarSrc,
  email, descripcion, contactoPublico,
  esPropio = false, puedeEditar = false,
  editarUrl, cambiarPasswordUrl, onCerrarSesion,
}: PerfilVistaProps) {
  const mostrarCuenta = esPropio || puedeEditar;

  return (
    <div className="perfil-page">
      <div className="perfil-banner">
        <div className="perfil-banner-inner">
          <div className="perfil-avatar-wrap">
            <img src={avatarSrc} alt="Avatar" className="perfil-avatar-xl" />
          </div>
          <div className="perfil-banner-info">
            <h1 className="perfil-nombre">{nombre || "Usuario"}</h1>
            <div className="perfil-meta">
              <span className={`perfil-rol ${getRolBadgeClass(rol)}`}>
                <i className={`fas ${getRolIcon(rol)}`} /> {rol || "USER"}
              </span>
              {fechaRegistro && (
                <span className="perfil-fecha">
                  <i className="fas fa-calendar-alt" /> Miembro desde {formatDate(fechaRegistro)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="perfil-content">
        <div className="perfil-card">
          <h2 className="perfil-card-title"><i className="fas fa-id-card" /> Información</h2>
          <div className="perfil-info-grid">
            <div className="perfil-info-item">
              <span className="perfil-info-label">Descripción</span>
              <span className="perfil-info-value">
                {descripcion || <span className="perfil-muted">Sin descripción</span>}
              </span>
            </div>
            {contactoPublico && (
              <div className="perfil-info-item">
                <span className="perfil-info-label">Contacto público</span>
                <span className="perfil-info-value">{contactoPublico}</span>
              </div>
            )}
            {esPropio && email && (
              <div className="perfil-info-item">
                <span className="perfil-info-label">Email</span>
                <span className="perfil-info-value">{email}</span>
              </div>
            )}
          </div>
        </div>

        {mostrarCuenta && (
          <div className="perfil-card">
            <h2 className="perfil-card-title"><i className="fas fa-cog" /> Cuenta</h2>
            <div className="perfil-acciones">
              <Link to={editarUrl} className="btn btn-primary">
                <i className="fas fa-edit" /> Editar perfil
              </Link>
              <Link to={cambiarPasswordUrl} className="btn btn-outline">
                <i className="fas fa-key" /> Cambiar contraseña
              </Link>
              {esPropio && onCerrarSesion && (
                <button className="btn btn-danger" onClick={onCerrarSesion}>
                  <i className="fas fa-sign-out-alt" /> Cerrar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}