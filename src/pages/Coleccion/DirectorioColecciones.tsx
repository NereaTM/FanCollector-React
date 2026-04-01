import { useEffect, useState } from "react";
import { getBuscarColecciones } from "../../data/coleccionesApi";
import ColeccionCard from "../../components/domain/ColeccionCard";
import SearchBar from "../../components/ui/SearchBar";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import type { Coleccion } from "../../types/coleccion";
import EstadoPagina from "../../components/ui/EstadoPagina";

const ITEMS_POR_PAGINA = 8;

export default function DirectorioColecciones() {
  const [todas, setTodas] = useState<Coleccion[]>([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    query: "",
    tipoBusqueda: "nombre",
    soloPlantillas: false,
  });

   useEffect(() => {
    async function cargar() {
      setLoading(true);
      setError(null);

      try {
        const filtrosApi: Record<string, unknown> = {};

        if (filtros.soloPlantillas) filtrosApi.usableComoPlantilla = true;

        if (filtros.query) {
          if (filtros.tipoBusqueda === "nombre") filtrosApi.nombre = filtros.query;
          if (filtros.tipoBusqueda === "categoria") filtrosApi.categoria = filtros.query;
          if (filtros.tipoBusqueda === "nombreCreador") filtrosApi.nombreCreador = filtros.query;
        }

        const data = await getBuscarColecciones(filtrosApi);
        setTodas(Array.isArray(data) ? data : []);
        setPagina(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar colecciones");
      } finally {
        setLoading(false);
      }
    }
        void cargar();
  }, [filtros]);


  // Paginación
  const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
  const colecciones = todas.slice(inicio, inicio + ITEMS_POR_PAGINA);
  const totalPaginas = Math.ceil(todas.length / ITEMS_POR_PAGINA);

  return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Catálogo" }]} />

      <div className="section">
        <div className="section-header">
          <h2>Todas las Colecciones Públicas</h2>
          <p>Explora las colecciones creadas por la comunidad</p>
        </div>

        <SearchBar onSearch={setFiltros} />

        <div className="coleccion-list">
          {colecciones.map((c) => (
            <ColeccionCard key={c.id} coleccion={c} />
          ))}
        </div>

        {/* ESTADOS */}
        {loading && <EstadoPagina loading="Cargando colecciones..." />}
        {error && <EstadoPagina error={error} />}

        {!loading && !error && colecciones.length === 0 && (
          <EstadoPagina icono="fa-search" titulo="Sin resultados" texto="No se encontraron colecciones" />
        )}

        {/* PAGINACIÓN */}
        {!loading && totalPaginas > 1 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              className="btn btn-outline"
              disabled={pagina === 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              ← Anterior
            </button>

            <span style={{ margin: "0 1rem" }}>
              Página {pagina} de {totalPaginas} · {todas.length} colecciones
            </span>

            <button
              className="btn btn-outline"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </>
  );
}