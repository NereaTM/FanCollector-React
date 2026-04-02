import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMisUsuarioColecciones, getColeccionById } from "../../data/coleccionesApi";
import { useAuth } from "../../auth/AuthContext";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ColeccionCard from "../../components/domain/ColeccionCard";
import type { Coleccion, ColeccionConRelacion, UsuarioColeccion } from "../../types/coleccion";

export default function MisColecciones() {
  const { user } = useAuth();
  const [creadas, setCreadas] = useState<ColeccionConRelacion[]>([]);
  const [unidas, setUnidas] = useState<ColeccionConRelacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function cargar() {
      try {
        const relaciones = await getMisUsuarioColecciones(userId) as UsuarioColeccion[];
        const lista = Array.isArray(relaciones) ? relaciones : [];

        const resultados = await Promise.all(
          lista.map(async (uc) => {
            const coleccion = (await getColeccionById(
              uc.idColeccion
            )) as Coleccion;
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

  const total = creadas.length + unidas.length;

  function renderLista(lista: ColeccionConRelacion[]) {
    return (
      <div className="coleccion-list">
        {lista.map(({ uc, coleccion }) => (
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
    );
  }

 return (
    <>
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Mis Colecciones" }]} />

      <div className="section">
        <div className="section-header">
          <h2>Mis Colecciones</h2>
          <p>
            {loading ? "Cargando..." : total > 0
              ? `${total} colección${total !== 1 ? "es" : ""} en tu perfil`
              : "Aún no tienes colecciones"}
          </p>
        </div>

        {!loading && !error && (
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 2rem 1rem" }}>
            <Link to="/colecciones/crear" className="btn btn-primary">
              <i className="fas fa-plus" /> Nueva colección
            </Link>
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

        {!loading && !error && total === 0 && (
          <EstadoPagina
            icono="fa-box-open"
            titulo="No tienes colecciones"
            texto="Crea tu primera colección o explora el catálogo para añadir una a tu perfil"
            volverUrl="/colecciones"
            volverTexto="Explorar catálogo"
          />
        )}

        {!loading && !error && total > 0 && (
          <>
            {creadas.length > 0 && (
              <>
                <div className="section-divider">
                  <h3><i className="fas fa-crown" /> Mis creaciones <span>{creadas.length}</span></h3>
                </div>
                {renderLista(creadas)}
              </>
            )}
            {unidas.length > 0 && (
              <>
                <div className="section-divider">
                  <h3><i className="fas fa-copy" /> Colecciones que uso <span>{unidas.length}</span></h3>
                </div>
                {renderLista(unidas)}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}