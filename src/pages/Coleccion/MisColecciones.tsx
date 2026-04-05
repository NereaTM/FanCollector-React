import { useEffect, useState } from "react";
import { getMisUsuarioColecciones, getColeccionById } from "../../data/coleccionesApi";
import { useAuth } from "../../auth/AuthContext";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ColeccionCard from "../../components/domain/ColeccionCard";
import type { Coleccion, ColeccionConRelacion, UsuarioColeccion } from "../../types/coleccion";

type Filtro = "todas" | "creadas" | "uso" | "favoritas";
type Orden  = "az" | "za";

export default function MisColecciones() {
  const { user } = useAuth();

  const [creadas, setCreadas] = useState<ColeccionConRelacion[]>([]);
  const [unidas, setUnidas] = useState<ColeccionConRelacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("az");

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function cargar() {
      try {
        const relaciones = await getMisUsuarioColecciones(userId) as UsuarioColeccion[];
        const lista = Array.isArray(relaciones) ? relaciones : [];
        const resultados = await Promise.all(
          lista.map(async (uc) => {
            const coleccion = await getColeccionById(uc.idColeccion) as Coleccion;
            return { uc, coleccion };
          })
        );
        setCreadas(resultados.filter((r) => r.uc.esCreador));
        setUnidas(resultados.filter((r) => !r.uc.esCreador));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar tus colecciones");
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [user?.id]);

    function aplicar(lista: ColeccionConRelacion[]) {
    let r = lista.filter((x) =>
      x.coleccion.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    if (filtro === "favoritas") r = r.filter((x) => x.uc.esFavorita);
    return [...r].sort((a, b) =>
      orden === "az"
        ? a.coleccion.nombre.localeCompare(b.coleccion.nombre)
        : b.coleccion.nombre.localeCompare(a.coleccion.nombre)
    );
  }

  const todas = [...creadas, ...unidas];
  const totalFavs = todas.filter((r) => r.uc.esFavorita).length;
  const listaFiltrada =
  filtro === "creadas" ? aplicar(creadas) :
  filtro === "uso" ? aplicar(unidas)  :
  aplicar(todas);


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
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Mis Colecciones" }]} />

      <div className="mc-page">

        <div className="mc-header">
          <div className="mc-header-left">
            <h2>Mis colecciones</h2>
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
            {listaFiltrada.map(({ uc, coleccion }) => (
              <ColeccionCard
                key={uc.id}
                coleccion={coleccion}
                esFavorita={uc.esFavorita}
                esCreador={uc.esCreador}
                fechaAgregada={uc.fechaAgregada}
                urlBase="mis-colecciones"
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
}