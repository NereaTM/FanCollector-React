import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getItemById, editarItem } from "../../data/itemsApi";
import { getApiErrorMessage } from "../../data/apiClient";
import { resolveImgUrl } from "../../utils/imagenes";
import { useImagenPreview } from "../../hooks/useImagenPreview";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import ModalConfirm from "../../components/ui/ModalConfirm";
import EstadoPagina from "../../components/ui/EstadoPagina";
import type { Item, ItemForm } from "../../types/item";
import defaultImg from "../../assets/default-collection.jpg";

const RAREZAS = ["COMUN", "RARO", "EPICO", "LEGENDARIO"] as const;

export default function ItemEditar() {
  const { coleccionId, itemId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { previewSrc, fileRef, handleFileChange, setImagenServidor } = useImagenPreview(defaultImg);

  const idColeccion = Number(coleccionId);
  const idItem = Number(itemId);
  const volverUrl = new URLSearchParams(search).get("from") ?? `/colecciones/${idColeccion}`;

  const [fields, setFields] = useState<ItemForm>({
    nombre: "",
    tipo: "",
    rareza: "COMUN",
    anioLanzamiento: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalGuardar, setModalGuardar] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);

  useEffect(() => {
    getItemById(idItem)
      .then((i) => {
        const item = i as Item;
        setFields({
          nombre: item.nombre,
          tipo: item.tipo ?? "",
          rareza: item.rareza,
          anioLanzamiento: item.anioLanzamiento ? String(item.anioLanzamiento) : "",
          descripcion: item.descripcion ?? "",
        });
        setImagenServidor(resolveImgUrl(item.imagenUrl) || defaultImg);
      })
      .catch((err: Error) => setError(err.message || "Error al cargar el item"))
      .finally(() => setLoading(false));
  }, [idItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
    }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModalGuardar(true);
  }

  async function confirmarGuardar() {
    const formData = new FormData();
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
    setModalGuardar(false);
    try {
      await editarItem(idItem, formData);
      toast.success("Item actualizado correctamente");
      navigate(volverUrl);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) return <EstadoPagina loading="Cargando item..." />;
  if (error) return <EstadoPagina error={error} volverUrl={volverUrl} />;

  return (
    <>
      <ModalConfirm
        abierto={modalGuardar}
        titulo="¿Guardar cambios?"
        mensaje="Se actualizará la información del item."
        labelConfirmar="Sí, guardar"
        onConfirmar={confirmarGuardar}
        onCancelar={() => setModalGuardar(false)}
      />
      <ModalConfirm
        abierto={modalCancelar}
        titulo="¿Cancelar la edición?"
        mensaje="Se perderán los cambios realizados."
        labelConfirmar="Sí, cancelar"
        onConfirmar={() => navigate(volverUrl)}
        onCancelar={() => setModalCancelar(false)}
      />

      <Breadcrumbs items={[
        { label: "Inicio", to: "/" },
        { label: "Mis Colecciones", to: "/mis-colecciones" },
        { label: fields.nombre || "Item", to: volverUrl },
        { label: "Editar item" },
      ]} />

      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">
            <i className="fas fa-edit" /> Editar item
          </h2>

          <form onSubmit={handleSubmit} className="coleccion-form">

            <div className="form-group">
              <label htmlFor="nombre">Nombre <span className="required">*</span></label>
              <input type="text" id="nombre" name="nombre" className="form-input" required
                value={fields.nombre} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group form-group--half">
                <label htmlFor="tipo">Tipo <span className="required">*</span></label>
                <input type="text" id="tipo" name="tipo" className="form-input" required
                  placeholder='Ej.: "Carta", "Figura"'
                  value={fields.tipo} onChange={handleChange} />
              </div>
              <div className="form-group form-group--half">
                <label htmlFor="rareza">Rareza</label>
                <select id="rareza" name="rareza" className="form-input"
                  value={fields.rareza} onChange={handleChange}>
                  {RAREZAS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="anioLanzamiento">Año de lanzamiento</label>
              <input type="number" id="anioLanzamiento" name="anioLanzamiento"
                className="form-input" min={0}
                value={fields.anioLanzamiento} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="archivo">Imagen</label>
              <div className="img-preview-wrap">
                <img src={previewSrc} alt="Vista previa del item"
                  className="img-preview img-preview--item" />
              </div>
              <input type="file" id="archivo" name="archivo" className="form-input"
                accept="image/*" ref={fileRef} onChange={handleFileChange} />
              <small className="form-help">JPG, PNG o GIF. Máximo 15MB. Deja vacío para mantener la actual.</small>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" className="form-textarea" rows={4}
                value={fields.descripcion} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <i className="fas fa-save" /> {saving ? "Guardando..." : "Guardar cambios"}
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
    </>
  );
}