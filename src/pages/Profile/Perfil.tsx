import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioById } from "../../data/usuariosApi";
import { useAuth } from "../../auth/AuthContext";
import { resolveImgUrl } from "../../utils/imagenes";
import PerfilVista from "../../components/domain/PerfilVista";
import defaultAvatar from "../../assets/iconoUser.png";
import type { AuthUser } from "../../types/auth";
import EstadoPagina from "../../components/ui/EstadoPagina";

export default function PerfilPropio() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    if (!user?.id) return;
    getUsuarioById(user.id)
      .then((u) => setUsuario(u as AuthUser))
      .catch((err: Error) => setError(err?.message || "Error al cargar el perfil"))
      .finally(() => setLoading(false));
  }, [user?.id]);
  if (loading) return <EstadoPagina loading="Cargando perfil..." />;
  if (error || !usuario) return (
    <EstadoPagina
      titulo="Error al cargar el perfil"
      error={error ?? "No se pudo cargar el perfil."}
      accion={{ label: "Reintentar", onClick: () => window.location.reload() }}
    />
  );

  return (
    <PerfilVista
      nombre={usuario.nombre}
      rol={usuario.rol}
      fechaRegistro={usuario.fechaRegistro}
      avatarSrc={resolveImgUrl(usuario.urlAvatar) || defaultAvatar}
      email={usuario.email}
      descripcion={usuario.descripcion}
      contactoPublico={usuario.contactoPublico}
      esPropio
      editarUrl="/perfil/editar"
      cambiarPasswordUrl="/perfil/cambiar-password"
      onCerrarSesion={() => { logout(); navigate("/login"); }}
    />
  );
}