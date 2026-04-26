import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBuscarColecciones } from "../../data/coleccionesApi";
import { getApiErrorMessage } from "../../data/apiClient";
import EstadoPagina from "../../components/ui/EstadoPagina";
import type { Coleccion } from "../../types/coleccion";
import { resolveImgUrl } from "../../utils/imagenes";
import defaultImg from "../../assets/default-collection.jpg";

type OrdenCol = "nombre" | "categoria" | "fechaCreacion";

export default function ModDashboard() {
  const [colecciones, setColecciones] = useState<Coleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenPor, setOrdenPor] = useState<OrdenCol>("fechaCreacion");

  function cargar() {
    setLoading(true);
    setError(null);
    getBuscarColecciones()
      .then((data) => setColecciones(data as Coleccion[]))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  const categorias = [...new Set(colecciones.map((c) => c.categoria))].sort();

  const lista = [...colecciones]
    .filter((c) => {
      const texto = busqueda.toLowerCase();
      return (
        !texto ||
        c.nombre.toLowerCase().includes(texto) ||
        c.nombreCreador.toLowerCase().includes(texto)
      );
    })
    .sort((a, b) => {
      const valorA = ordenPor === "nombre" ? a.nombre : ordenPor === "categoria" ? a.categoria : a.fechaCreacion;
      const valorB = ordenPor === "nombre" ? b.nombre : ordenPor === "categoria" ? b.categoria : b.fechaCreacion;
      return valorA.localeCompare(valorB);
    })

  const publicas = colecciones.filter((c) => c.esPublica).length;
  const plantillas = colecciones.filter((c) => c.usableComoPlantilla).length;

  const STATS = [
    { label: "Total", count: colecciones.length },
    { label: "Públicas", count: publicas },
    { label: "Plantillas", count: plantillas },
    { label: "Categorías", count: categorias.length },
  ];

  if (loading) return <EstadoPagina loading="Cargando colecciones..." />;
  if (error) {
    return (
      <EstadoPagina
        titulo="Error al cargar colecciones"
        error={error}
        accion={{ label: "Reintentar", onClick: cargar }}
      />);
  }

  return (
    <div className="mc-page">
      <div className="mc-header">
        <div className="mc-header-left">
          <h2><i className="fas fa-shield-alt" style={{ marginRight: "0.5rem" }} />Panel de moderación</h2>
          <p>Moderador — gestión del contenido público</p>
        </div>
        <div className="mc-stats">
          {STATS.map(({ label, count }) => (
            <div key={label} className="mc-stat">
              <span className="mc-stat-count">{count}</span>
              <span className="mc-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mc-controls">
        <div className="mc-search-wrap">
          <input type="search" placeholder="Buscar por nombre o creador..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <i className="fas fa-search" />
        </div>

        <select className="mc-sort" value={ordenPor} onChange={(e) => setOrdenPor(e.target.value as OrdenCol)}>
          <option value="nombre">Nombre A→Z</option>
          <option value="categoria">Categoría</option>
          <option value="fechaCreacion">Más recientes</option>
        </select>
      </div>

      {lista.length === 0 ? (
        <EstadoPagina
          icono="fa-folder-open"
          titulo="Sin resultados"
          texto="No hay colecciones que coincidan con los filtros."
        />
      ) : (
        <div className="db-tabla-wrapper">
          <table className="db-tabla">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Creador</th>
                <th>Estado</th>
                <th>Creada</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.id}>
                  <td>
                    <img
                      src={resolveImgUrl(c.imagenPortada) || defaultImg}
                      alt={c.nombre}
                      className="db-thumb db-thumb--collection"
                    />
                  </td>
                  <td className="td-id">{c.id}</td>
                  <td>
                    <Link to={`/colecciones/${c.id}`} className="db-nombre-link">
                      {c.nombre}
                    </Link>
                  </td>
                  <td>
                    <span className="db-badge db-badge--cat">{c.categoria}</span>
                  </td>
                  <td>{c.nombreCreador}</td>
                  <td>
                    <span className={`db-badge ${c.esPublica ? "db-badge--ok" : "db-badge--off"}`}>
                      {c.esPublica ? "Pública" : "Privada"}
                    </span>
                    {c.usableComoPlantilla && (
                      <span className="db-badge db-badge--plantilla">Plantilla</span>
                    )}
                  </td>
                  <td className="td-fecha">
                    {new Date(c.fechaCreacion).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}