import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMisUsuarioColeccionesDetalle } from "../../data/coleccionesApi";
import { useAuth } from "../../auth/AuthContext";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ColeccionCard from "../../components/domain/ColeccionCard";
import type { UsuarioColeccionDetalle } from "../../types/coleccion";

type Filtro = "todas" | "creadas" | "uso" | "favoritas";
type Orden = "az" | "za";

export default function MisColecciones() {
  const { user } = useAuth();
  const { userId } = useParams<{ userId?: string }>();

  const esModoOtroUsuario = !!userId;
  const idObjetivo = userId ?? user?.id;

  const [creadas, setCreadas] = useState<UsuarioColeccionDetalle[]>([]);
  const [unidas, setUnidas] = useState<UsuarioColeccionDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("az");
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  useEffect(() => {
    if (!idObjetivo) {
      setLoading(false);
      return;
    }

    async function cargar() {
      try {
        setLoading(true);
        setError(null);
        const detalle = await getMisUsuarioColeccionesDetalle(idObjetivo!);
        const lista = Array.isArray(detalle) ? detalle : [];
        setCreadas(lista.filter((r) => r.esCreador));
        setUnidas(lista.filter((r) => !r.esCreador));
        if (lista.length > 0) {
          setNombreUsuario(lista[0].nombreUsuario);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar colecciones");
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [idObjetivo]);

  function aplicar(lista: UsuarioColeccionDetalle[]) {
  return [...lista]
    .filter((x) => x.coleccion.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((x) => filtro !== "favoritas" || x.esFavorita)
    .sort((a, b) =>
      orden === "az"
        ? a.coleccion.nombre.localeCompare(b.coleccion.nombre)
        : b.coleccion.nombre.localeCompare(a.coleccion.nombre)
    );
}

  const todas = [...creadas, ...unidas];
  const totalFavs = todas.filter((r) => r.esFavorita).length;
  let listaBase = todas;
  if (filtro === "creadas") listaBase = creadas;
  if (filtro === "uso") listaBase = unidas;

  const listaFiltrada = aplicar(listaBase);

  const STATS = [
    { label: "Total", count: todas.length },
    { label: "Creadas", count: creadas.length },
    { label: "En uso", count: unidas.length },
    { label: "Favoritas", count: totalFavs },
  ];

  const FILTROS: { key: Filtro; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "creadas", label: "Creadas" },
    { key: "uso", label: "En uso" },
    { key: "favoritas", label: "⭐ Favoritas" },
  ];

  return (
    <>
      <Breadcrumbs
        items={
          esModoOtroUsuario
            ? [{ label: "Inicio", to: "/" }, { label: `Colecciones de ${nombreUsuario ?? "usuario"}` }]
            : [{ label: "Inicio", to: "/" }, { label: "Mis Colecciones" }]
        }
      />

      <div className="mc-page">

        <div className="mc-header">
          <div className="mc-header-left">
            <h2>
              {esModoOtroUsuario
                ? `Colecciones de ${nombreUsuario ?? "usuario"}`
                : "Mis colecciones"}
            </h2>
            <p>Todo lo que coleccionas en un solo lugar</p>
          </div>

          {!loading && !error && (
            <div className="mc-stats">
              {STATS.map(({ label, count }) => (
                <div key={label} className="mc-stat">
                  <span className="mc-stat-count">{count}</span>
                  <span className="mc-stat-label">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && !error && todas.length > 0 && (
          <div className="mc-controls">
            <div className="mc-search-wrap">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <i className="fas fa-search" />
            </div>

            <div className="mc-filter-group">
              {FILTROS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`mc-filter${filtro === key ? " mc-filter--activo" : ""}`}
                  onClick={() => setFiltro(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              className="mc-sort"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
            >
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </div>
        )}

        {loading && <EstadoPagina loading="Cargando tus colecciones..." />}

        {!loading && error && (
          <EstadoPagina
            titulo="Error al cargar tus colecciones"
            error={error}
            accion={{ label: "Reintentar", onClick: () => window.location.reload() }}
          />
        )}

        {!loading && !error && todas.length === 0 && (
          <EstadoPagina
            icono="fa-box-open"
            titulo="No tienes colecciones"
            texto="Crea tu primera colección o explora el catálogo"
            volverUrl="/colecciones"
            volverTexto="Explorar catálogo"
          />
        )}

        {!loading && !error && todas.length > 0 && listaFiltrada.length === 0 && (
          <EstadoPagina
            icono="fa-search"
            titulo="Sin resultados"
            texto="No hay colecciones que coincidan con tu búsqueda"
          />
        )}

        {!loading && !error && listaFiltrada.length > 0 && (
          <div className="coleccion-list">
            {listaFiltrada.map((item) => (
              <ColeccionCard
                key={item.id}
                coleccion={item.coleccion}
                esFavorita={item.esFavorita}
                esCreador={item.esCreador}
                fechaAgregada={item.fechaAgregada}
                urlBase={esModoOtroUsuario ? `usuario/${userId}/colecciones` : "mis-colecciones"}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}