import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getColeccionById } from "../../data/coleccionesApi";
import { getItemsPorColeccion, getUsuarioItemsPorColeccion } from "../../data/itemsApi";
import type { Coleccion } from "../../types/coleccion";
import type { Item, UsuarioItemOut } from "../../types/item";
import { resolveImgUrl } from "../../utils/imagenes";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ItemCard from "../../components/domain/ItemCard";
import ColeccionDetalleImagen from "../../components/domain/ColeccionDetalleImagen";
import ColeccionDetalleInfo from "../../components/domain/ColeccionDetalleInfo";
import defaultImg from "../../assets/default-collection.jpg";

export default function UsuarioColeccionesDetalleAjeno() {
  const { userId, id } = useParams();
  const idColeccion = Number(id);

  const [coleccion, setColeccion] = useState<Coleccion | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [usuarioItems, setUsuarioItems] = useState<UsuarioItemOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(idColeccion) || idColeccion <= 0) {
      setError("ID de colección no válido");
      setLoading(false);
      return;
    }

    async function cargar() {
      try {
        const coleccion = await getColeccionById(idColeccion) as Coleccion;
        setColeccion(coleccion);

        const items = await getItemsPorColeccion(idColeccion);
        setItems(Array.isArray(items) ? items as Item[] : []);

        const usuarioItems = await getUsuarioItemsPorColeccion(userId!, idColeccion).catch(() => []);
        setUsuarioItems(Array.isArray(usuarioItems) ? usuarioItems as UsuarioItemOut[] : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar la colección");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [idColeccion, userId]);

  if (loading) return <EstadoPagina loading="Cargando colección..." />;
  if (error || !coleccion) return (
    <EstadoPagina volverUrl={`/usuario/${userId}/colecciones`} volverTexto="Volver a colecciones" />
  );

  const creadorId = coleccion.idCreador ?? null;
  const creadorNombre = coleccion.nombreCreador ?? "Desconocido";
  const imgSrc = resolveImgUrl(coleccion.imagenPortada) || defaultImg;

  // Solo se ven items que el usuario tiene visibles, sino muestra la tarjeta como de serie 
  const itemsVisibles = items.filter((item) => {
    const usuarioItem = usuarioItems.find((u) => u.idItem === item.id);
    return usuarioItem && usuarioItem.esVisible !== false;
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: "Inicio", to: "/" },
        { label: `Colecciones de ${usuarioItems[0]?.nombreUsuario ?? coleccion.nombreCreador ?? "usuario"}`, to: `/usuario/${userId}/colecciones` },
        { label: coleccion.nombre },
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
          </div>

          <ColeccionDetalleInfo
            categoria={coleccion.categoria}
            creadorId={creadorId}
            creadorNombre={creadorNombre}
            esPublica={coleccion.esPublica ?? false}
            descripcion={coleccion.descripcion || ""}
            logueado={true}
            esPropio={false}
          />
        </div>
      </div>

      <section className="section bg-light">
        <div className="section-header">
          <h2>Items de la Colección</h2>
          <p>{itemsVisibles.length} item{itemsVisibles.length !== 1 ? "s" : ""} en total</p>
        </div>

        {itemsVisibles.length === 0 ? (
          <EstadoPagina
            icono="fa-box-open"
            titulo="No hay items"
            texto="Esta colección aún no tiene items."
          />
        ) : (
          <div className="coleccion-list">
            {itemsVisibles.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                usuarioItem={usuarioItems.find((u) => u.idItem === item.id) ?? null}
                puedeEditar={false}
                idColeccion={idColeccion}
                returnUrl={`/usuario/${userId}/colecciones/${idColeccion}`}
                onEliminar={null}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}