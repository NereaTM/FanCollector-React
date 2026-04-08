import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAPI, getApiErrorMessage } from "../../data/apiClient";
import EstadoPagina from "../../components/ui/EstadoPagina";
import type { UsuarioOut } from "../../types/usuario";
import { resolveImgUrl } from "../../utils/imagenes";
import defaultImg from "../../assets/default-collection.jpg";

type OrdenCol = "nombre" | "rol" | "fechaRegistro";


export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState<UsuarioOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenPor, setOrdenPor] = useState<OrdenCol>("nombre");

  function cargar() {
    setLoading(true);
    setError(null);
    fetchAPI<UsuarioOut[]>("/usuarios")
      .then(setUsuarios)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  const lista = [...usuarios]
    .filter((u) => {
      const texto = busqueda.toLowerCase();
      return (
        !texto ||
        u.nombre.toLowerCase().includes(texto) ||
        String(u.id).includes(texto)
      );
    })
    .sort((a, b) => {
      const valorA = ordenPor === "nombre" ? a.nombre : ordenPor === "rol" ? (a.rol ?? "") : (a.fechaRegistro ?? "");
      const valorB = ordenPor === "nombre" ? b.nombre : ordenPor === "rol" ? (b.rol ?? "") : (b.fechaRegistro ?? "");
      return valorA.localeCompare(valorB);
    })

  const STATS = [
    { label: "Total", count: usuarios.length },
    { label: "Admins", count: usuarios.filter((u) => u.rol?.toUpperCase() === "ADMIN").length },
    { label: "Mods", count: usuarios.filter((u) => u.rol?.toUpperCase() === "MODS").length },
    { label: "Usuarios", count: usuarios.filter((u) => u.rol?.toUpperCase() === "USER").length },
  ];

  if (loading) return <EstadoPagina loading="Cargando usuarios..." />;
  if (error) {
    return (
      <EstadoPagina
        titulo="Error al cargar usuarios"
        error={error}
        accion={{ label: "Reintentar", onClick: cargar }}
      />
    );
  }

  return (
    <div className="mc-page">
      <div className="mc-header">
        <div className="mc-header-left">
          <h2><i className="fas fa-users-cog" style={{ marginRight: "0.5rem" }} />Panel de usuarios</h2>
          <p>Administrador — directorio completo de cuentas</p>
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
          <input type="search" placeholder="Buscar por nombre o ID..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <i className="fas fa-search" />
        </div>

        <select className="mc-sort" value={ordenPor} onChange={(e) => setOrdenPor(e.target.value as OrdenCol)}>
          <option value="nombre">Nombre A→Z</option>
          <option value="rol">Rol</option>
          <option value="fechaRegistro">Más recientes</option>
        </select>
      </div>

      {lista.length === 0 ? (
        <EstadoPagina
          icono="fa-users-slash"
          titulo="Sin resultados"
          texto="No hay usuarios que coincidan con los filtros."
        />
      ) : (
        <div className="db-tabla-wrapper">
          <table className="db-tabla">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id}>
                  <td>
                    <img
                      src={resolveImgUrl(u.urlAvatar) || defaultImg}
                      alt={u.nombre}
                      className="db-thumb"
                    />
                  </td>
                  <td className="td-id">{u.id}</td>
                  <td>
                    <Link to={`/usuario/${u.id}/perfil`} className="db-nombre-link">
                      {u.nombre}
                    </Link>
                  </td>
                  <td>
                    <span className={`rol-badge rol-${u.rol?.toLowerCase()}`}>{u.rol}</span>
                  </td>
                  <td className="td-fecha">
                    {u.fechaRegistro
                      ? new Date(u.fechaRegistro).toLocaleDateString("es-ES")
                      : "—"}
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