import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { cambiarContrasena } from "../../data/usuariosApi";
import { getApiErrorMessage } from "../../data/apiClient";
import { useAuth } from "../../auth/AuthContext";
import PasswordInput from "../../components/ui/PasswordInput";
import ModalConfirm from "../../components/ui/ModalConfirm";

export default function PerfilCambiarPassword() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const targetId = userId ? Number(userId) : user?.id;
  const volverUrl = `/usuario/${targetId}/perfil`;

  const [fields, setFields] = useState({ contrasena: "", confirmar: "" });
  const [errores, setErrores] = useState({ contrasena: "", confirmar: "" });
  const [saving, setSaving] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nuevosErrores = { contrasena: "", confirmar: "" };

    if (fields.contrasena.length < 6)
      nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres";
    if (fields.contrasena !== fields.confirmar)
      nuevosErrores.confirmar = "Las contraseñas no coinciden";

    setErrores(nuevosErrores);
    if (nuevosErrores.contrasena || nuevosErrores.confirmar) return;

    setModalConfirmar(true);
  }

  async function confirmarCambio() {
    if (!targetId) return;
    setSaving(true);
    setModalConfirmar(false);
    try {
      await cambiarContrasena(targetId, fields.contrasena);
      toast.success("Contraseña actualizada correctamente");
      navigate(volverUrl);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <>
      <ModalConfirm
        abierto={modalConfirmar}
        titulo="¿Cambiar contraseña?"
        mensaje="Se actualizará la contraseña de la cuenta."
        labelConfirmar="Sí, cambiar"
        onConfirmar={confirmarCambio}
        onCancelar={() => setModalConfirmar(false)}
      />

      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">
            <i className="fas fa-key" /> Cambiar contraseña
          </h2>

          <form onSubmit={handleSubmit} className="coleccion-form">

            <div className="form-group">
              <label htmlFor="contrasena">Nueva contraseña <span className="required">*</span></label>
              <PasswordInput
                id="contrasena" name="contrasena"
                value={fields.contrasena} onChange={handleChange}
                className="form-input"
              />
              <small className="form-help">Mínimo 6 caracteres.</small>
              {errores.contrasena && <p className="form-error">{errores.contrasena}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmar">Confirmar contraseña <span className="required">*</span></label>
              <PasswordInput
                id="confirmar" name="confirmar"
                value={fields.confirmar} onChange={handleChange}
                className="form-input"
              />
              {errores.confirmar && <p className="form-error">{errores.confirmar}</p>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <i className="fas fa-save" /> {saving ? "Guardando..." : "Cambiar contraseña"}
              </button>
              <Link to={volverUrl} className="btn btn-outline">
                <i className="fas fa-times" /> Cancelar
              </Link>
            </div>

            <p className="form-footer">
              <span className="required">*</span> Campos obligatorios
            </p>

          </form>
        </div>
      </div>
    </>
  );
}