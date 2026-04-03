import { useEffect, useCallback, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getColeccionById, borrarColeccion, eliminarUsuarioColeccion, getUsuarioColeccionPorUsuarioYColeccion, patchFavorita } from "../../data/coleccionesApi";
import { getItemsPorColeccion, getMisUsuarioItems, borrarItem } from "../../data/itemsApi";
import type { Coleccion, Relacion } from "../../types/coleccion";
import type { Item, UsuarioItemOut } from "../../types/item";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import PanelAdmin from "../../components/ui/PanelAdmin";
import Aviso from "../../components/ui/Aviso";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ItemCard from "../../components/domain/ItemCard";
import ColeccionDetalleImagen from "../../components/domain/ColeccionDetalleImagen";
import ColeccionDetalleInfo from "../../components/domain/ColeccionDetalleInfo";
import ModalConfirm from "../../components/ui/ModalConfirm";
import defaultImg from "../../assets/default-collection.jpg";

type Modal = { tipo: "coleccion" | "perfil" | "item"; id?: number } | null;

export default function MisColeccionesDetalle() {
  // Id de la colección desde la URL
  const { id } = useParams();
  const navigate = useNavigate();
  // Usuario autenticado
  const { user } = useAuth();
  // Conversión del id a número
  const idColeccion = Number(id);
  // Estados principales
  const [coleccion, setColeccion] = useState<Coleccion | null>(null);
  const [relacion, setRelacion] = useState<Relacion>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [misItems, setMisItems] = useState<UsuarioItemOut[]>([]);
  // Estados de control
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estados de acciones
  const [togFav, setTogFav] = useState(false);
  const [modal, setModal] = useState<Modal>(null);

  const cargar = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Colección base
      const col = await getColeccionById(idColeccion) as Coleccion;
      setColeccion(col);
      // Relación usuario-colección para saber si es favorita
      const rel = await getUsuarioColeccionPorUsuarioYColeccion(user.id, idColeccion)
        .then((r: unknown) => {
          const item = (Array.isArray(r) ? r[0] : r) as { id: number; esFavorita: boolean } | null;
          if (!item) return null;
          return { id: item.id, esFavorita: item.esFavorita };
        })
        .catch(() => null);
      setRelacion(rel);
      // Items de la colección
      const its = await getItemsPorColeccion(idColeccion);
      setItems(Array.isArray(its) ? its as Item[] : []);
      // Items del usuario (estado, visibilidad, etc.)
      const todos = await getMisUsuarioItems(user.id).catch(() => []);
      setMisItems((todos as UsuarioItemOut[]).filter((ui) => ui.idColeccion === idColeccion));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la colección");
    } finally {
      setLoading(false);
    }
  }, [idColeccion, user?.id]);

  useEffect(() => {
    // Validación del id antes de cargar datos
    if (!Number.isFinite(idColeccion) || idColeccion <= 0) {
      setError("ID de colección no válido"); setLoading(false); return;
    }
    cargar();
  }, [cargar, idColeccion]);

  async function handleTogFavorita() {
    if (!relacion?.id || togFav) return;
    setTogFav(true);
    try {
      const nuevoValor = !relacion.esFavorita;
      await patchFavorita(relacion.id, nuevoValor);
      setRelacion((r) => r ? { ...r, esFavorita: nuevoValor } : r);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar favorita");
    } finally {
      setTogFav(false);
    }
  }
  // Apertura de modales según acción
  const handleEliminarColeccion = () => setModal({ tipo: "coleccion" });
  const handleQuitarDePerfil = () => setModal({ tipo: "perfil" });
  const handleEliminarItem = (itemId: number) => setModal({ tipo: "item", id: itemId });
  // Confirmaciones de acciones críticas
  async function confirmarEliminarColeccion() {
    setModal(null);
    try {
      await borrarColeccion(idColeccion);
      toast.success("Colección eliminada");
      navigate("/mis-colecciones");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar la colección");
    }
  }

  async function confirmarQuitarDePerfil() {
    if (!relacion?.id) return;
    setModal(null);
    try {
      await eliminarUsuarioColeccion(relacion.id);
      toast.success("Colección quitada de tu perfil");
      navigate("/mis-colecciones");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo quitar la colección");
    }
  }

  async function confirmarEliminarItem() {
    const itemId = modal?.id;
    setModal(null);
    if (!itemId) return;
    try {
      await borrarItem(itemId);
      toast.success("Item eliminado");
      await cargar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar el item");
    }
  }
  // Estados globales de la página
  if (loading) return <EstadoPagina loading="Cargando colección..." />;
  if (error || !coleccion) return (
    <EstadoPagina titulo="Error" error={error ?? undefined}
      volverUrl="/mis-colecciones" volverTexto="Volver a Mis Colecciones" />
  );

  // Datos derivados de la colección y permisos
  const creadorId = coleccion.idCreador ?? null;
  const creadorNombre = coleccion.nombreCreador ?? "Desconocido";
  const esCreador = creadorId === user?.id;
  const esAdmin = user?.rol === "ADMIN";
  const esMod = user?.rol === "MODS";
  const puedeEditar = esCreador || esAdmin || (esMod && (coleccion.esPublica ?? false));
  const idUC = relacion?.id ?? null;
  const esFavorita = relacion?.esFavorita ?? false;
  const imgSrc = resolveImgUrl(coleccion.imagenPortada) || defaultImg;
  // Filtrado de items visibles según configuración del usuario
  const itemsVisibles = items.filter((item) => {
    const ui = misItems.find((u) => u.idItem === item.id);
    return !ui || ui.esVisible !== false;
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: "Inicio", to: "/" },
        { label: "Mis Colecciones", to: "/mis-colecciones" },
        { label: coleccion.nombre }
      ]} />

      <div className="coleccion-detalle-page">

        <ColeccionDetalleImagen
          imgSrc={imgSrc}
          nombre={coleccion.nombre}
          esPlantilla={coleccion.usableComoPlantilla ?? false}
        />

        <div className="coleccion-detalle-info">

          <div className="coleccion-detalle-header">
            <h2 className="coleccion-detalle-nombre">{coleccion.nombre}</h2>

            {idUC && (
              <button
                className="btn btn-outline btn-fav-icon"
                onClick={handleTogFavorita}
                disabled={togFav}
              >
                <i className={`fa-star ${esFavorita ? "fas star-activa" : "far star-inactiva"}`} />
              </button>
            )}
          </div>

          <ColeccionDetalleInfo
            categoria={coleccion.categoria}
            creadorId={creadorId}
            creadorNombre={creadorNombre}
            esPublica={coleccion.esPublica ?? false}
            descripcion={coleccion.descripcion || ""}
            logueado={true}
            esPropio={esCreador}
          />

          {idUC && (
            <div className="coleccion-detalle-card">
              <h3 className="coleccion-detalle-card-title">
                <i className="fas fa-layer-group" /> Mis items
              </h3>
              <Link
                to={`/mis-colecciones/${idColeccion}/items/editar`}
                className="btn btn-primary"
              >
                <i className="fas fa-sliders-h" /> Ajustar visibilidad y estado
              </Link>
            </div>
          )}
        </div>

        {idUC && (
          <div className="coleccion-detalle-card coleccion-detalle-card--admin">
            <h3 className="coleccion-detalle-card-title">
              <i className="fas fa-cog" /> Gestión de la colección
            </h3>

            {esCreador ? (
              <PanelAdmin
                editarUrl={`/colecciones/${idColeccion}/editar`}
                añadirItemUrl={`/colecciones/${idColeccion}/items/crear`}
                onBorrar={handleEliminarColeccion}
              />
            ) : (
              <>
                <Aviso tipo="info">
                  Esta colección está en tu perfil desde una plantilla o colección pública.
                </Aviso>
                <div style={{ marginTop: "1rem" }}>
                  <button className="btn btn-danger" onClick={handleQuitarDePerfil}>
                    <i className="fas fa-link-slash" /> Quitar de mi perfil
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      <section className="section bg-light">
        <div className="section-header">
          <h2>Items de la Colección</h2>
          <p>{itemsVisibles.length} item{itemsVisibles.length !== 1 ? "s" : ""} en total</p>
        </div>
        {itemsVisibles.length === 0 && items.length > 0 ? (
          <EstadoPagina icono="fa-eye-slash" titulo="No hay items visibles" texto="Has ocultado todos los items."
            volverUrl={`/mis-colecciones/${idColeccion}/items/editar`} volverTexto="Ajustar visibilidad" />
        ) : itemsVisibles.length === 0 ? (
          <EstadoPagina icono="fa-box-open" titulo="No hay items" texto="Esta colección aún no tiene items." />
        ) : (
          <div className="coleccion-list">
            {itemsVisibles.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                usuarioItem={misItems.find((u) => u.idItem === item.id) || null}
                puedeEditar={puedeEditar}
                idColeccion={idColeccion}
                onEliminar={puedeEditar ? handleEliminarItem : null}
              />
            ))}
          </div>
        )}
      </section>

      <ModalConfirm abierto={modal?.tipo === "coleccion"} titulo="¿Eliminar colección?" mensaje="Esta acción no se puede deshacer." labelConfirmar="Eliminar" onConfirmar={confirmarEliminarColeccion} onCancelar={() => setModal(null)} />
      <ModalConfirm abierto={modal?.tipo === "perfil"} titulo="¿Quitar de tu perfil esta colección?" labelConfirmar="Quitar" onConfirmar={confirmarQuitarDePerfil} onCancelar={() => setModal(null)} />
      <ModalConfirm abierto={modal?.tipo === "item"} titulo="¿Eliminar este item?" mensaje="Esta acción no se puede deshacer." labelConfirmar="Eliminar" onConfirmar={confirmarEliminarItem} onCancelar={() => setModal(null)} />
    </>
  );
}