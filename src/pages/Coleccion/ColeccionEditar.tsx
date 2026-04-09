import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getColeccionById, editarColeccion } from "../../data/coleccionesApi";
import { getApiErrorMessage } from "../../data/apiClient";
import { resolveImgUrl } from "../../utils/imagenes";
import { useImagenPreview } from "../../hooks/useImagenPreview";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import ModalConfirm from "../../components/ui/ModalConfirm";
import EstadoPagina from "../../components/ui/EstadoPagina";
import type { Coleccion, ColeccionForm } from "../../types/coleccion";
import defaultImg from "../../assets/default-collection.jpg";

export default function ColeccionEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { previewSrc, fileRef, handleFileChange, setImagenServidor } = useImagenPreview(defaultImg);

  const idColeccion = Number(id);
  const volverUrl = `/mis-colecciones/${idColeccion}`;

  const [fields, setFields] = useState<ColeccionForm>({
    nombre: "",
    descripcion: "",
    categoria: "",
    esPublica: false,
    usableComoPlantilla: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalGuardar, setModalGuardar] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);

  useEffect(() => {
    getColeccionById(idColeccion)
      .then((c) => {
        const col = c as Coleccion;
        setFields({
          nombre: col.nombre,
          descripcion: col.descripcion ?? "",
          categoria: col.categoria,
          esPublica: col.esPublica,
          usableComoPlantilla: col.usableComoPlantilla,
        });
        setImagenServidor(resolveImgUrl(col.imagenPortada) || defaultImg);
      })
      .catch((err: Error) => setError(err.message || "Error al cargar la colección"))
      .finally(() => setLoading(false));
  }, [idColeccion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    formData.append("descripcion", fields.descripcion.trim());
    formData.append("categoria", fields.categoria.trim());
    formData.append("esPublica", String(fields.esPublica));
    formData.append("usableComoPlantilla", String(fields.usableComoPlantilla));
    const archivo = fileRef.current?.files?.[0];
    if (archivo) formData.append("archivo", archivo);

    setSaving(true);
    setModalGuardar(false);
    try {
      await editarColeccion(idColeccion, formData);
      toast.success("Colección actualizada correctamente");
      navigate(volverUrl);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) return <EstadoPagina loading="Cargando colección..." />;
  if (error) return <EstadoPagina error={error} volverUrl={volverUrl} />;

  return (
    <>
      <ModalConfirm
        abierto={modalGuardar}
        titulo="¿Guardar cambios?"
        mensaje="Se actualizará la información de la colección."
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
        { label: fields.nombre || "Colección", to: volverUrl },
        { label: "Editar colección" },
      ]} />

      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">
            <i className="fas fa-edit" /> Editar colección
          </h2>

          <form onSubmit={handleSubmit} className="coleccion-form">

            <div className="form-group">
              <label htmlFor="nombre">Nombre <span className="required">*</span></label>
              <input type="text" id="nombre" name="nombre" className="form-input" required
                value={fields.nombre} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría <span className="required">*</span></label>
              <input type="text" id="categoria" name="categoria" className="form-input" required
                placeholder='Ej.: "Anime", "Videojuegos", "Cómics", "K-pop"...'
                value={fields.categoria} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" className="form-textarea" rows={4}
                placeholder="Describe tu colección..." value={fields.descripcion} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="archivo">Imagen de portada</label>
              <div className="img-preview-wrap">
                <img src={previewSrc} alt="Vista previa de la portada"
                  className="img-preview img-preview--collection" />
              </div>
              <input type="file" id="archivo" name="archivo" className="form-input"
                accept="image/*" ref={fileRef} onChange={handleFileChange} />
              <small className="form-help">JPG, PNG o GIF. Máximo 15MB. Deja vacío para mantener la actual.</small>
            </div>

            <div className="form-group">
              <label className="check">
                <input type="checkbox" name="esPublica"
                  checked={fields.esPublica} onChange={handleChange} />
                <span> Colección pública</span>
              </label>
              <div className="form-help">Si está activo, otros usuarios podrán ver esta colección.</div>
            </div>

            <div className="form-group">
              <label className="check">
                <input type="checkbox" name="usableComoPlantilla"
                  checked={fields.usableComoPlantilla} onChange={handleChange} />
                <span> Usable como plantilla</span>
              </label>
              <div className="form-help">Permite que otros usuarios copien esta colección si es pública.</div>
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