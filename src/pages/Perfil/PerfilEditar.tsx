import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsuarioById, editarUsuario, eliminarUsuario } from "../../data/usuariosApi";
import { getApiErrorMessage } from "../../data/apiClient";
import { useAuth } from "../../auth/AuthContext";
import { useImagenPreview } from "../../hooks/useImagenPreview";
import { resolveImgUrl } from "../../utils/imagenes";
import { formatDate } from "../../utils/date";
import defaultAvatar from "../../assets/iconoUser.png";
import type { AuthUser } from "../../types/auth";
import { getRolBadgeClass, getRolIcon } from "../../utils/roles";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ModalConfirm from "../../components/ui/ModalConfirm";

export default function PerfilEditar() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, logout } = useAuth();
  const { previewSrc, fileRef, handleFileChange, setImagenServidor } = useImagenPreview(defaultAvatar);

  const myId = user?.id ?? null;
  const targetId = userId ? Number(userId) : myId;
  const esAjeno = userId ? Number(userId) !== myId : false;
  const esAdmin = user?.rol === "ADMIN";

  const volverUrl = `/usuario/${targetId ?? myId}/perfil`;

  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [fields, setFields] = useState({ nombre: "", email: "", descripcion: "", contactoPublico: "", rol: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalGuardar, setModalGuardar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    getUsuarioById(targetId)
      .then((u: unknown) => {
        const perfil = u as AuthUser;
        setUsuario(perfil);
        setFields({
          nombre: perfil?.nombre ?? "",
          email: perfil?.email ?? "",
          descripcion: perfil?.descripcion ?? "",
          contactoPublico: perfil?.contactoPublico ?? "",
          rol: perfil?.rol ?? "",
        });
        setImagenServidor(resolveImgUrl(perfil?.urlAvatar) || defaultAvatar);
      })
      .catch((err: Error) => setError(err?.message || "Error al cargar el perfil"))
      .finally(() => setLoading(false));
  }, [targetId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModalGuardar(true);
  }

  async function confirmarGuardar() {
    if (!targetId) return;
    const formData = new FormData();
    formData.append("nombre", fields.nombre.trim());
    formData.append("email", fields.email.trim());
    formData.append("descripcion", fields.descripcion.trim());
    formData.append("contactoPublico", fields.contactoPublico.trim());
    const archivo = fileRef.current?.files?.[0];
    if (archivo) formData.append("archivo", archivo);

    setSaving(true);
    setModalGuardar(false);
    try {
      await editarUsuario(targetId, formData);
      toast.success("Perfil actualizado correctamente");
      navigate(volverUrl);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setSaving(false);
    }
  }

  async function handleEliminarCuenta() {
    const idAEliminar = esAjeno ? targetId : myId;
    if (!idAEliminar) return;
    try {
      await eliminarUsuario(idAEliminar);
      toast.success("Cuenta eliminada correctamente");
      if (!esAjeno) {
        logout();
        navigate("/login");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setModalEliminar(false);
    }
  }

  if (loading) return <EstadoPagina loading="Cargando editor..." />;
  if (error) return <EstadoPagina error={error} volverUrl={volverUrl} />;

  return (
    <>
      <ModalConfirm
        abierto={modalGuardar}
        titulo="¿Guardar cambios?"
        mensaje="Se actualizará la información del perfil."
        labelConfirmar="Sí, guardar"
        onConfirmar={confirmarGuardar}
        onCancelar={() => setModalGuardar(false)}
      />
      <ModalConfirm
        abierto={modalEliminar}
        titulo="¿Eliminar cuenta?"
        mensaje="Esta acción es permanente. Se eliminarán todos tus datos y no podrás recuperar tu cuenta."
        labelConfirmar="Sí, eliminar mi cuenta"
        onConfirmar={handleEliminarCuenta}
        onCancelar={() => setModalEliminar(false)}
      />

      <div className="perfil-page">
        <div className="perfil-banner">
          <div className="perfil-banner-inner">
            <div className="perfil-avatar-wrap">
              <img src={previewSrc} alt="Avatar" className="perfil-avatar-xl" />
            </div>
            <div className="perfil-banner-info">
              <h1 className="perfil-nombre">{fields.nombre || "Sin nombre"}</h1>
              <div className="perfil-meta">
                <span className={`perfil-rol ${getRolBadgeClass(fields.rol)}`}>
                  <i className={`fas ${getRolIcon(fields.rol)}`} /> {fields.rol || "USER"}
                </span>
                {usuario?.fechaRegistro && (
                  <span className="perfil-fecha">
                    <i className="fas fa-calendar-alt" /> Miembro desde {formatDate(usuario.fechaRegistro)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="perfil-content">
          <div className="form-card">
            <h2 className="form-title"><i className="fas fa-edit" /> Editar perfil</h2>
            <form onSubmit={handleSubmit} className="coleccion-form">

              <div className="avatar-upload-section">
                <div className="form-group">
                  <label htmlFor="archivo">Cambiar avatar</label>
                  <input type="file" id="archivo" name="archivo" className="form-input"
                    accept="image/*" ref={fileRef} onChange={handleFileChange} />
                  <small className="form-help">JPG, PNG o GIF. Máximo 15MB.</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-group--half">
                  <label htmlFor="nombre">Nombre <span className="required">*</span></label>
                  <input type="text" id="nombre" name="nombre" className="form-input" required
                    value={fields.nombre} onChange={handleChange} />
                </div>
                <div className="form-group form-group--half">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input type="email" id="email" name="email" className="form-input" required
                    value={fields.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" className="form-textarea"
                  placeholder="Cuéntanos sobre ti..." value={fields.descripcion} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="contactoPublico">Contacto público</label>
                <input type="text" id="contactoPublico" name="contactoPublico" className="form-input"
                  placeholder="@usuario, email público..." value={fields.contactoPublico} onChange={handleChange} />
                <div className="form-help">Visible para otros usuarios.</div>
              </div>

              {esAdmin && esAjeno && (
                <div className="form-group">
                  <label htmlFor="rol">Rol</label>
                  <select id="rol" name="rol" className="form-input" value={fields.rol} onChange={handleChange}>
                    <option value="USER">USUARIO</option>
                    <option value="ADMIN">ADMINISTRADOR</option>
                    <option value="MODS">MODERADOR</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <i className="fas fa-save" /> {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <Link to={volverUrl} className="btn btn-outline">
                  <i className="fas fa-times" /> Cancelar
                </Link>
              </div>
              <p className="form-footer">
                <span className="required">* Campos obligatorios</span>
              </p>
            </form>
          </div>
          <div className="perfil-card perfil-card--danger">
            <h2 className="perfil-card-title perfil-card-title--danger">
              <i className="fas fa-exclamation-triangle" /> Zona de peligro
            </h2>
            <p className="perfil-danger-desc">
              {esAjeno
                ? `Una vez elimines la cuenta de "${fields.nombre}", todos sus datos se borrarán permanentemente.`
                : "Una vez elimines tu cuenta, todos tus datos se borrarán de forma permanente y no podrás recuperarlos."
              }
            </p>
            <button className="btn btn-danger" onClick={() => setModalEliminar(true)}>
              <i className="fas fa-user-times" />
              {esAjeno ? " Eliminar este usuario" : " Eliminar mi cuenta"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}