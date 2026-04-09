import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { crearColeccion } from "../../data/coleccionesApi";
import { getApiErrorMessage } from "../../data/apiClient";
import { useAuth } from "../../auth/AuthContext";
import { useImagenPreview } from "../../hooks/useImagenPreview";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import ModalConfirm from "../../components/ui/ModalConfirm";
import type { ColeccionForm } from "../../types/coleccion";
import defaultImg from "../../assets/default-collection.jpg";

export default function ColeccionCrear() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { previewSrc, fileRef, handleFileChange } = useImagenPreview(defaultImg);

  const [fields, setFields] = useState<ColeccionForm>({
    nombre: "",
    descripcion: "",
    categoria: "",
    esPublica: false,
    usableComoPlantilla: false,
  });
  const [saving, setSaving] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("idCreador", String(user!.id));
    formData.append("nombre", fields.nombre.trim());
    formData.append("descripcion", fields.descripcion.trim());
    formData.append("categoria", fields.categoria.trim());
    formData.append("esPublica", String(fields.esPublica));
    formData.append("usableComoPlantilla", String(fields.usableComoPlantilla));
    const archivo = fileRef.current?.files?.[0];
    if (archivo) formData.append("archivo", archivo);

    setSaving(true);
    try {
      await crearColeccion(formData);
      toast.success("Colección creada correctamente");
      navigate("/mis-colecciones");
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
        { label: "Nueva colección" },
      ]} />

      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title"><i className="fas fa-plus" /> Nueva colección</h2>

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
              <small className="form-help">JPG, PNG o GIF. Máximo 15MB.</small>
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
                <i className="fas fa-save" /> {saving ? "Creando..." : "Crear colección"}
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
        onConfirmar={() => navigate("/mis-colecciones")}
        onCancelar={() => setModalCancelar(false)}
      />
    </>
  );
}