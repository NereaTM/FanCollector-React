import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../data/apiClient";
import { getItemsPorColeccion, borrarItem } from "../../data/itemsApi";
import { getColeccionById, crearUsuarioColeccion, getUsuarioColeccionPorUsuarioYColeccion, borrarColeccion } from "../../data/coleccionesApi";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ModalConfirm from "../../components/ui/ModalConfirm";
import PanelAdmin from "../../components/ui/PanelAdmin";
import Aviso from "../../components/ui/Aviso";
import ColeccionDetalleImagen from "../../components/domain/ColeccionDetalleImagen";
import ColeccionDetalleInfo from "../../components/domain/ColeccionDetalleInfo";
import ColeccionDetalleCta from "../../components/domain/ColeccionDetalleCta";
import ItemCard from "../../components/domain/ItemCard";
import defaultImg from "../../assets/default-collection.jpg";
import type { Coleccion } from "../../types/coleccion";
import type { Item } from "../../types/item";


export default function ColeccionDetalle() {
  // id de ruta
  const { id } = useParams();
  const navigate = useNavigate();
  // datos de usuario
  const { user, token } = useAuth();
  // conversión id
  const idColeccion = Number(id ?? 0);
  // estado de la pagina 
  const [coleccion, setColeccion] = useState<Coleccion | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [yaUnido, setYaUnido] = useState(false);
  // estado de carga y errroes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // estados de accciones del usuario
  const [uniendose, setUniendose] = useState(false);
  const [modalBorrar, setModalBorrar] = useState(false);
  const [modalItem, setModalItem] = useState<number | null>(null);
  // permisos 
  const logueado = !!token;
  const esAdmin = user?.rol === "ADMIN";
  const esMod = user?.rol === "MODS";

  useEffect(() => {
    // validación del id anes de llamar a la api
    if (!Number.isFinite(idColeccion) || idColeccion <= 0) {
      setError("ID de colección no válido"); setLoading(false); return;
    }
    async function cargar() {
      try {
        const col = await getColeccionById(idColeccion) as Coleccion;
        setColeccion(col);
        // Si hay usuario logueado, comprobamos si ya tiene esta colección en su perfil
        if (user?.id) {
          try {
            const rel = await getUsuarioColeccionPorUsuarioYColeccion(user.id, idColeccion);
            setYaUnido(Array.isArray(rel) ? rel.length > 0 : !!rel);
          } catch { setYaUnido(false); }
        }
        // Carga de los items asociados a la colección
        const its = await getItemsPorColeccion(idColeccion);
        setItems(Array.isArray(its) ? its as Item[] : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar la colección");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [idColeccion, user?.id]);
  // Añade la colección al perfil del usuario
  async function handleUnirse() {
    if (!user?.id) return;
    setUniendose(true);
    try {
      await crearUsuarioColeccion({ idUsuario: user.id, idColeccion });
      setYaUnido(true);
      navigate(`/mis-colecciones/${idColeccion}`);
      toast.success("¡Colección añadida a tu perfil!");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUniendose(false);
    }
  }
  // Borra la colección completa tras confirmar en el modal
  async function confirmarBorrar() {
    setModalBorrar(false);
    try {
      await borrarColeccion(idColeccion);
      navigate("/colecciones");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }
  // Borra un item concreto y actualiza la lista en pantalla
  async function confirmarEliminarItem() {
    if (!modalItem) return;
    const idItem = modalItem;
    setModalItem(null);
    try {
      await borrarItem(idItem);
      setItems((prev) => prev.filter((i) => i.id !== idItem));
      toast.success("Item eliminado correctamente");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }
  // Estados globales de la página
  if (loading) return <EstadoPagina loading="Cargando colección..." />;
  if (error || !coleccion) return (
    <EstadoPagina titulo="Error" error={error ?? undefined}
      volverUrl="/colecciones" volverTexto="Volver al catálogo" />
  );
  
  // Datos de la colección ya cargada
  const publico = coleccion.esPublica;
  const plantilla = coleccion.usableComoPlantilla;
  const puedeModerar = esAdmin || (esMod && publico);
  const creadorId = coleccion.idCreador ?? null;
  const creadorNombre = coleccion.nombreCreador ?? "Desconocido";
  const imgSrc = resolveImgUrl(coleccion.imagenPortada) || defaultImg;

  return (
    <>
      <Breadcrumbs items={[
        { label: "Inicio", to: "/" },
        { label: "Catálogo", to: "/colecciones" },
        { label: coleccion.nombre }
      ]} />

      <div className="coleccion-detalle-page">

        <ColeccionDetalleImagen
          imgSrc={imgSrc}
          nombre={coleccion.nombre}
          esPlantilla={plantilla}
        />

        <div className="coleccion-detalle-info">
          <div className="coleccion-detalle-header">
            <h2 className="coleccion-detalle-nombre">{coleccion.nombre}</h2>
          </div>

          <ColeccionDetalleInfo
            categoria={coleccion.categoria}
            creadorId={creadorId}
            creadorNombre={creadorNombre}
            esPublica={publico}
            descripcion={coleccion.descripcion || ""}
            logueado={logueado}
          />

          {publico && plantilla && (
            <ColeccionDetalleCta
              logueado={logueado}
              yaUnido={yaUnido}
              uniendose={uniendose}
              onUnirse={handleUnirse}
            />
          )}
        </div>

        {puedeModerar && (
          <div className="coleccion-detalle-card coleccion-detalle-card--admin">
            <h3 className="coleccion-detalle-card-title">
              <i className="fas fa-cog" /> Administración
            </h3>
            {!publico && <Aviso tipo="warning">Esta colección no es pública.</Aviso>}
            <PanelAdmin
              editarUrl={`/colecciones/${coleccion.id}/editar`}
              añadirItemUrl={`/colecciones/${coleccion.id}/items/crear?from=${encodeURIComponent(`/colecciones/${coleccion.id}`)}`}
              onBorrar={() => setModalBorrar(true)}
            />
          </div>
        )}

      </div>

      <section className="section bg-light">
        <div className="section-header">
          <h2>Items de la Colección</h2>
          <p>{items.length} item{items.length !== 1 ? "s" : ""} en total</p>
        </div>
        {items.length === 0 ? (
          <EstadoPagina icono="fa-box-open" titulo="No hay items en esta colección"
            texto="Esta colección aún no tiene items agregados" />
        ) : (
          <div className="coleccion-list">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                puedeEditar={puedeModerar}
                idColeccion={idColeccion}
                returnUrl={puedeModerar ? `/colecciones/${idColeccion}` : null}
                onEliminar={puedeModerar ? (id) => setModalItem(id) : null}
              />
            ))}
          </div>
        )}
      </section>

      <ModalConfirm
        abierto={modalBorrar}
        titulo="¿Eliminar esta colección?"
        mensaje="Esta acción no se puede deshacer."
        labelConfirmar="Eliminar"
        onConfirmar={confirmarBorrar}
        onCancelar={() => setModalBorrar(false)}
      />

      <ModalConfirm
        abierto={!!modalItem}
        titulo="¿Eliminar este item?"
        mensaje="Esta acción no se puede deshacer."
        labelConfirmar="Eliminar"
        onConfirmar={confirmarEliminarItem}
        onCancelar={() => setModalItem(null)}
      />
    </>
  );
}