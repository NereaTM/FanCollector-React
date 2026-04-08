import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getColeccionById } from "../../data/coleccionesApi";
import { getItemsPorColeccion, getUsuarioItemsDetallados, crearUsuarioItem, actualizarUsuarioItem } from "../../data/itemsApi";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EstadoPagina from "../../components/ui/EstadoPagina";
import ModalConfirm from "../../components/ui/ModalConfirm";
import defaultImg from "../../assets/default-collection.jpg";
import type { Coleccion } from "../../types/coleccion";
import type { Item, EstadoItem, UsuarioItemDetalleDTO, FilaItem } from "../../types/item";

const ESTADOS: EstadoItem[] = ["TENGO", "BUSCO", "DROPEO", "EN_CAMINO"];

export default function MisItemsEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const idColeccion = Number(id);

  const [coleccion, setColeccion] = useState<Coleccion | null>(null);
  const [filas, setFilas] = useState<FilaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVolver, setModalVolver] = useState(false);
  const [hayPendientes, setHayPendientes] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(idColeccion) || idColeccion <= 0) {
      setError("ID de colección no válido");
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    async function cargarDatos() {
      if (!user?.id) return;

      try {
        const coleccionData = (await getColeccionById(idColeccion)) as Coleccion;
        const itemsColeccion = (await getItemsPorColeccion(idColeccion)) as Item[];
        const usuarioItems = (await getUsuarioItemsDetallados(user.id, idColeccion).catch(
          () => []
        )) as UsuarioItemDetalleDTO[];

        setColeccion(coleccionData);

        const filasMapeadas: FilaItem[] = (Array.isArray(itemsColeccion) ? itemsColeccion : []).map(
          (item) => {
            const usuarioItem =
              (Array.isArray(usuarioItems) ? usuarioItems : []).find(
                (usuarioItemActual) => usuarioItemActual.idItem === item.id
              ) ?? null;

            return {
              item,
              ui: usuarioItem,
              esVisible: usuarioItem?.esVisible ?? true,
              estado: usuarioItem?.estado ?? "BUSCO",
              cantidad: usuarioItem?.cantidad ?? 1,
              notas: usuarioItem?.notas ?? "",
              saving: false,
              guardado: false,
            };
          }
        );

        setFilas(filasMapeadas);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los items");
      } finally {
        setLoading(false);
      }
    }

    void cargarDatos();
  }, [idColeccion, user]);

  function actualizar<K extends keyof FilaItem>(
    index: number,
    campo: K,
    valor: FilaItem[K]
  ) {
    setFilas((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
    setHayPendientes(true);
  }

  async function guardarTodos() {
    if (!user?.id) return;

    setSaving(true);

    const resultados = await Promise.all(
      filas.map(async (fila) => {
        const datosActualizar = {
          estado: fila.estado,
          esVisible: fila.esVisible,
          cantidad: fila.cantidad,
          notas: fila.notas.trim() || undefined,
        };

        try {
          if (fila.ui) {
            await actualizarUsuarioItem(fila.ui.id, datosActualizar);
          } else {
            await crearUsuarioItem({
              idUsuario: user.id,
              idItem: fila.item.id,
              idColeccion: idColeccion,
              ...datosActualizar,
            });
          }
          return true;
        } catch {
          return false;
        }
      })
    );

    const errores = resultados.filter((resultado) => !resultado).length;

    setSaving(false);
    setHayPendientes(false);

    if (errores > 0) {
      toast.error(`${errores} item(s) no se pudieron guardar`);
    } else {
      toast.success("Cambios guardados");
      navigate(`/mis-colecciones/${idColeccion}`);
    }
  }

  function handleVolver() {
    if (hayPendientes) {
      setModalVolver(true);
    } else {
      navigate(`/mis-colecciones/${idColeccion}`);
    }
  }

  if (loading) {
    return <EstadoPagina loading="Cargando items..." />;
  }

  if (error || !coleccion) {
    return (
      <EstadoPagina
        titulo="Error"
        error={error ?? undefined}
        volverUrl={`/mis-colecciones/${idColeccion}`}
        volverTexto="Volver a la colección"
      />
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Mis Colecciones", to: "/mis-colecciones" },
          { label: coleccion.nombre, to: `/mis-colecciones/${idColeccion}` },
          { label: "Ajustar items" },
        ]}
      />

      <div className="form-page">
        <div className="form-header">
          <h1 className="form-title">
            <i className="fas fa-sliders-h" /> Ajustar items
          </h1>
          <p className="form-subtitle">
            {coleccion.nombre} · {filas.length} items
          </p>
        </div>

        {filas.length === 0 ? (
          <EstadoPagina
            icono="fa-box-open"
            titulo="No hay items"
            texto="Esta colección aún no tiene items."
            volverUrl={`/mis-colecciones/${idColeccion}`}
            volverTexto="Volver"
          />
        ) : (
          <>
            <div className="mis-items-grid">
              {filas.map((fila, index) => {
                const imagen = resolveImgUrl(fila.item.imagenUrl) || defaultImg;

                return (
                  <div key={fila.item.id} className="card mis-items-card">
                    <img
                      src={imagen}
                      alt={fila.item.nombre}
                      className="mis-items-img"
                    />

                    <p className="card-title mis-items-nombre">{fila.item.nombre}</p>

                    <div className="mis-items-controles">
                      <div className="form-group">
                        <label>Estado</label>
                        <select
                          className="form-control"
                          value={fila.estado}
                          onChange={(e) =>
                            actualizar(index, "estado", e.target.value as EstadoItem)
                          }
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Cantidad</label>
                        <input
                          type="number"
                          className="form-control"
                          min={1}
                          value={fila.cantidad}
                          onChange={(e) =>
                            actualizar(
                              index,
                              "cantidad",
                              Math.max(1, Number(e.target.value))
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Notas</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Opcional..."
                          value={fila.notas}
                          onChange={(e) => actualizar(index, "notas", e.target.value)}
                        />
                      </div>

                      <label className="check">
                        <input
                          type="checkbox"
                          checked={fila.esVisible}
                          onChange={(e) =>
                            actualizar(index, "esVisible", e.target.checked)
                          }
                        />
                        <i
                          className={`fas ${fila.esVisible ? "fa-eye" : "fa-eye-slash"
                            }`}
                        />
                        {fila.esVisible ? "Visible" : "Oculto"}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mis-items-barra">
              <div className="form-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleVolver}
                >
                  <i className="fas fa-arrow-left" /> Volver
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={guardarTodos}
                  disabled={saving || !hayPendientes}
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save" /> Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ModalConfirm
        abierto={modalVolver}
        titulo="¿Salir sin guardar?"
        mensaje="Tienes cambios sin guardar. Si sales ahora se perderán."
        labelConfirmar="Salir de todas formas"
        onConfirmar={() => navigate(`/mis-colecciones/${idColeccion}`)}
        onCancelar={() => setModalVolver(false)}
      />
    </>
  );
}