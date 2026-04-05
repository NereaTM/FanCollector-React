import { useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { crearItem } from "../../data/itemsApi";
import { getApiErrorMessage } from "../../data/apiClient";
import { useAuth } from "../../auth/AuthContext";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import ModalConfirm from "../../components/ui/ModalConfirm";

const RAREZAS = ["COMUN", "RARO", "EPICO", "LEGENDARIO"] as const;

type Fields = {
  nombre: string;
  tipo: string;
  rareza: string;
  anioLanzamiento: string;
  descripcion: string;
};

export default function ItemCrear() {
  const { coleccionId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const idColeccion = Number(coleccionId);
  const returnUrl = new URLSearchParams(search).get("from") ?? `/colecciones/${idColeccion}`;

  const [fields, setFields] = useState<Fields>({
    nombre: "",
    tipo: "",
    rareza: "COMUN",
    anioLanzamiento: "",
    descripcion: "",
  });
  const [saving, setSaving] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFields((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.nombre.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (!fields.tipo.trim()) { toast.error("El tipo es obligatorio"); return; }

    const formData = new FormData();
    formData.append("idColeccion", String(idColeccion));
    formData.append("nombre", fields.nombre.trim());
    formData.append("tipo", fields.tipo.trim());
    formData.append("rareza", fields.rareza);
    formData.append("descripcion", fields.descripcion.trim());

    const anio = Number(fields.anioLanzamiento);
    if (fields.anioLanzamiento && Number.isFinite(anio)) {
      formData.append("anioLanzamiento", String(anio));
    }

    const archivo = fileRef.current?.files?.[0];
    if (archivo) formData.append("archivo", archivo);

    setSaving(true);
    try {
      await crearItem(formData);
      toast.success("Item creado correctamente");
      navigate(returnUrl);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: "Inicio", to: "/" },
        { label: "Mis Colecciones", to: "/mis-colecciones" },
        { label: "Colección", to: returnUrl },
        { label: "Nuevo item" },
      ]} />

      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">
            <i className="fas fa-plus" /> Nuevo item
          </h2>

          <form onSubmit={handleSubmit} className="coleccion-form">

            <div className="form-group">
              <label htmlFor="nombre">Nombre <span className="required">*</span></label>
              <input
                type="text" id="nombre" name="nombre"
                className="form-input" required
                value={fields.nombre} onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group form-group--half">
                <label htmlFor="tipo">Tipo <span className="required">*</span></label>
                <input
                  type="text" id="tipo" name="tipo"
                  className="form-input" required
                  placeholder='Ej.: "Carta", "Figura"'
                  value={fields.tipo} onChange={handleChange}
                />
              </div>
              <div className="form-group form-group--half">
                <label htmlFor="rareza">Rareza</label>
                <select
                  id="rareza" name="rareza"
                  className="form-input"
                  value={fields.rareza} onChange={handleChange}
                >
                  {RAREZAS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="anioLanzamiento">Año de lanzamiento</label>
              <input
                type="number" id="anioLanzamiento" name="anioLanzamiento"
                className="form-input" min={0}
                value={fields.anioLanzamiento} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="archivo">Imagen</label>
              <input
                type="file" id="archivo" name="archivo"
                className="form-input" accept="image/*"
                ref={fileRef}
              />
              <small className="form-help">JPG, PNG o GIF. Máximo 15MB.</small>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion" name="descripcion"
                className="form-textarea" rows={4}
                value={fields.descripcion} onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <i className="fas fa-save" /> {saving ? "Guardando..." : "Crear item"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setModalCancelar(true)}>
                <i className="fas fa-times" /> Cancelar
              </button>
            </div>

            <p className="form-footer">
              <span className="required">*</span> Campos obligatorios
            </p>

          </form>
        </div>
      </div>

      <ModalConfirm
        abierto={modalCancelar}
        titulo="¿Cancelar la creación?"
        mensaje="Se perderán los datos introducidos."
        labelConfirmar="Sí, cancelar"
        onConfirmar={() => navigate(returnUrl)}
        onCancelar={() => setModalCancelar(false)}
      />
    </>
  );
}