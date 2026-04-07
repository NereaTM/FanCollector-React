import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUsuarioById } from "../../data/usuariosApi";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import PerfilVista from "../../components/domain/PerfilVista";
import defaultAvatar from "../../assets/iconoUser.png";
import type { AuthUser } from "../../types/auth";
import EstadoPagina from "../../components/ui/EstadoPagina";

export default function PerfilUsuario() {
  const { userId } = useParams<{ userId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const esPropio = user?.id === Number(userId);
  const puedeEditar = user?.rol === "ADMIN" || user?.rol === "MODS";

  useEffect(() => {
    if (!userId) return;
    getUsuarioById(userId)
      .then((u) => setUsuario(u as AuthUser))
      .catch((err: Error) => setError(err?.message || "Error al cargar el perfil"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <EstadoPagina loading="Cargando perfil..." />;
  if (error || !usuario) return (
    <EstadoPagina
      titulo="Error al cargar el perfil"
      error={error ?? "No se pudo cargar el perfil."}
      accion={{ label: "Reintentar", onClick: () => window.location.reload() }}
    />
  );

  return (
    <>
      {/* Botón "Ver colecciones" solo si es perfil ajeno */}
      {!esPropio && (
        <div style={{ padding: "1rem" }}>
          <Link
            to={`/usuario/${userId}/colecciones`}
            className="btn btn-outline"
          >
            <i className="fas fa-layer-group" /> Ver colecciones
          </Link>
        </div>
      )}

      <PerfilVista
        nombre={usuario.nombre}
        rol={usuario.rol}
        fechaRegistro={usuario.fechaRegistro}
        avatarSrc={resolveImgUrl(usuario.urlAvatar) || defaultAvatar}
        email={esPropio || puedeEditar ? usuario.email : undefined}
        descripcion={usuario.descripcion}
        contactoPublico={usuario.contactoPublico}
        esPropio={esPropio}
        puedeEditar={puedeEditar}
        editarUrl={`/usuario/${userId}/perfil/editar`}
        cambiarPasswordUrl={`/usuario/${userId}/perfil/cambiar-password`}
        onCerrarSesion={
          esPropio ? () => { logout(); navigate("/login"); } : undefined
        }
      />
    </>
  );
}